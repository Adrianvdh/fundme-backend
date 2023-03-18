import { NextFunction, Request, Response } from 'express';
import { User } from '@/modules/users/models/users.interface';
import AuthService from '@/modules/auth/service/auth.service';
import { LoginRequest, RequestWithUser } from '@/modules/auth/api/auth.models';
import { CreateUserRequest } from '@/modules/users/api/users.model';

class AuthController {
    constructor(private authService: AuthService) {}

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const signUpUserData: User = await this.authService.signup(userData);

            res.status(201).json({ data: signUpUserData, message: 'signup' });
        } catch (error) {
            next(error);
        }
    };

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: LoginRequest = req.body;
            const { cookie, findUser } = await this.authService.login(userData);

            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json({ data: findUser, message: 'login' });
        } catch (error) {
            next(error);
        }
    };

    public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const logOutUserData: User = await this.authService.logout(req.user);

            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
            res.status(200).json({ data: logOutUserData, message: 'logout' });
        } catch (error) {
            next(error);
        }
    };
}

export default AuthController;
