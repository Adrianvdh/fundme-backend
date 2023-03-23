import { NextFunction, Request, Response } from 'express';
import { User } from '@/modules/users/models/users.interface';
import AuthService from '@/modules/auth/service/auth.service';
import { LoginRequest, RequestWithUser } from '@/modules/auth/api/auth.models';
import { CreateUserRequest } from '@/modules/users/api/users.model';

class AuthController {
    constructor(private authService: AuthService) {}

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const signUpUserData: User = await this.authService.signup(userData);

            res.status(201).json(signUpUserData);
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

    public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const logOutUserData: User = await this.authService.logout(req.user);

            res.status(200).json(logOutUserData);
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
