import { NextFunction, Request, Response } from 'express';
import AuthService from '@/modules/auth/service/auth.service';
import { LoginRequest, LoginResponse } from '@/modules/auth/api/auth.models';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';
import UserService from '@/modules/users/service/users.service';

class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.userService.createUser(userData);

            res.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginRequest = req.body;
            const loginResponse: LoginResponse = await this.authService.login(userData);

            res.status(200).json(loginResponse);
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
