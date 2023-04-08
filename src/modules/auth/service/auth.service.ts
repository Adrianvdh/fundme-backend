import { compare } from 'bcrypt';
import { isEmpty } from '@/shared/utils/util';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { User } from '@/modules/users/models/users.interface';
import { LoginRequest, LoginResponse } from '@/modules/auth/api/auth.models';
import { BaseException, ValidationError } from '@/shared/exceptions/exceptions';
import { Authenticator } from '@/modules/auth/service/authenticator';
import { mapDisplayableUserToUserResponse } from '@/modules/users/api/users.model';
import { IStorageService } from '@/shared/storage/storage';

export class AuthenticationException extends BaseException {
    public statusCode = 400;
    constructor(message: string) {
        super(message);
    }
}

class AuthService {
    constructor(private userRepository: IUserRepository, private storageService: IStorageService) {}

    public async login(userData: LoginRequest): Promise<LoginResponse> {
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
        const userResponse = await mapDisplayableUserToUserResponse(findUser, this.storageService);

        return {
            ...tokenData,
            user: userResponse,
        };
    }
}

export default AuthService;
