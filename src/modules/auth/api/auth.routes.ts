import { Router } from 'express';
import AuthController from '@/modules/auth/api/auth.controller';
import { Routes } from '@/shared/framework/routes.interface';
import authMiddleware from '@/modules/auth/middleware/auth.middleware';
import validateBodyMiddleware from '@/shared/http/middlewares/validate-body.middleware';
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
        this.router.post(`${this.path}register`, validateBodyMiddleware(CreateUserRequest, 'body'), this.authController.register);
        this.router.post(`${this.path}login`, validateBodyMiddleware(LoginRequest, 'body'), this.authController.logIn);
        this.router.post(`${this.path}logout`, authMiddleware(this.userRepository), this.authController.logOut);
    }
}

export default AuthRoutes;
