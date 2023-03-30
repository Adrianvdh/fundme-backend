import { compare, hash } from 'bcrypt';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';
import { User } from '@/modules/users/models/users.interface';
import { LoginRequest, TokenData } from '@/modules/auth/api/auth.models';
import { BaseException, ValidationError } from '@/shared/exceptions/exceptions';
import { Authenticator } from '@/modules/auth/service/authenticator';

export class AuthenticationException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

class AuthService {
    constructor(private userRepository: IUserRepository) {}

    public async signup(userData: CreateUserRequest): Promise<UserResponse> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: User = await this.userRepository.findOneByEmail(userData.email);
        if (findUser) {
            throw new ValidationError({ email: `This email ${userData.email} already exists` });
        }

        const hashedPassword = await hash(userData.password, 10);
        const user = await this.userRepository.create({ ...userData, password: hashedPassword });
        return {
            _id: user._id.toString(),
            email: user.email,
        };
    }

    public async login(userData: LoginRequest): Promise<{ tokenData: TokenData; cookie: string }> {
        if (isEmpty(userData)) {
            throw new ValidationError('Empty request!');
        }

        const findUser: User = await this.userRepository.findOneByEmail(userData.email);
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

        return { tokenData, cookie };
    }
}

export default AuthService;
