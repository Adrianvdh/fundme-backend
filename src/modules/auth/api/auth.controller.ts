import { NextFunction, Request, Response } from 'express';
import AuthService from '@/modules/auth/service/auth.service';
import { LoginRequest } from '@/modules/auth/api/auth.models';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';

class AuthController {
    constructor(private authService: AuthService) {}

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.authService.signup(userData);

            res.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginRequest = req.body;
            const { tokenData } = await this.authService.login(userData);

            res.status(200).json(tokenData);
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
