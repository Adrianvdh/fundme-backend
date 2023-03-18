import { compare, hash } from 'bcrypt';
import { HttpException } from '@/shared/http/exceptions/HttpException';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { CreateUserRequest } from '@/modules/users/api/users.model';
import { User } from '@/modules/users/models/users.interface';
import { LoginRequest } from '@/modules/auth/api/auth.models';
import { AlreadyExists, BaseException, IllegalArgument, NotFound } from '@/shared/exceptions/exceptions';
import { Authenticator } from '@/modules/auth/service/authenticator';

export class AuthenticationException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

class AuthService {
    constructor(private userRepository: IUserRepository) {}

    public async signup(userData: CreateUserRequest): Promise<User> {
        if (isEmpty(userData)) {
            throw new IllegalArgument('userData is empty');
        }

        const findUser: User = await this.userRepository.findOne({ email: userData.email });
        if (findUser) {
            throw new AlreadyExists(userData.email, `This email ${userData.email} already exists`);
        }

        const hashedPassword = await hash(userData.password, 10);
        return await this.userRepository.create({ ...userData, password: hashedPassword });
    }

    public async login(userData: LoginRequest): Promise<{ cookie: string; findUser: User }> {
        if (isEmpty(userData)) {
            throw new IllegalArgument('userData is empty');
        }

        const findUser: User = await this.userRepository.findOne({ email: userData.email });
        if (!findUser) {
            throw new AuthenticationException(`Username or password did not match!`);
        }

        const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
        if (!isPasswordMatching) {
            throw new AuthenticationException(`Username or password did not match!`);
        }

        const authenticator = new Authenticator();
        const tokenData = authenticator.createToken(findUser);
        const cookie = authenticator.createCookie(tokenData);

        return { cookie, findUser };
    }

    public async logout(userData: User): Promise<User> {
        if (isEmpty(userData)) {
            throw new HttpException(400, 'userData is empty');
        }

        const findUser: User = await this.userRepository.findOne({ email: userData.email, password: userData.password });
        if (!findUser) {
            throw new NotFound("User doesn't exist");
        }

        return findUser;
    }
}

export default AuthService;
