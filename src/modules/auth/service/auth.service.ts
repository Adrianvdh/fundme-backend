import { compare } from 'bcrypt';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { User } from '@/modules/users/models/users.interface';
import { LoginRequest, TokenData } from '@/modules/auth/api/auth.models';
import { BaseException, ValidationError } from '@/shared/exceptions/exceptions';
import { Authenticator } from '@/modules/auth/service/authenticator';

export class AuthenticationException extends BaseException {
    public statusCode = 400;
    constructor(message: string) {
        super(message);
    }
}

class AuthService {
    constructor(private userRepository: IUserRepository) {}

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
