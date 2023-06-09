import AuthController from '@/modules/auth/api/auth.controller';
import { Routes } from '@/shared/framework/routes.interface';
import validated from '@/shared/http/middlewares/validate-body.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { CreateUserRequest } from '@/modules/users/api/users.model';
import { LoginRequest } from '@/modules/auth/api/auth.models';

class AuthRoutes extends Routes {
    public path = '/';

    constructor(private authController: AuthController, private userRepository: UserRepository) {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}register`, validated(CreateUserRequest, 'body'), this.authController.register);
        this.router.post(`${this.path}login`, validated(LoginRequest, 'body'), this.authController.logIn);
    }
}

export default AuthRoutes;
