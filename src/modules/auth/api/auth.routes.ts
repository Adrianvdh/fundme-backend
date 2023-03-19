import { Router } from 'express';
import AuthController from '@/modules/auth/api/auth.controller';
import { Routes } from '@/shared/framework/routes.interface';
import authMiddleware from '@/modules/auth/middleware/auth.middleware';
import validationMiddleware from '@/shared/http/middlewares/validation.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { CreateUserRequest } from '@/modules/users/api/users.model';
import { LoginRequest } from '@/modules/auth/api/auth.models';

class AuthRoutes implements Routes {
    public path = '/';
    public router = Router();

    constructor(private authController: AuthController, private userRepository: UserRepository) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}signup`, validationMiddleware(CreateUserRequest, 'body'), this.authController.signUp);
        this.router.post(`${this.path}login`, validationMiddleware(LoginRequest, 'body'), this.authController.logIn);
        this.router.post(`${this.path}logout`, authMiddleware(this.userRepository), this.authController.logOut);
    }
}

export default AuthRoutes;
