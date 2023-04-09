import { NextFunction, Request, Response } from 'express';
import UserService from '@/modules/users/service/users.service';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';
import { RequestWithUser } from '@/modules/auth/api/auth.models';
import { File } from '@/shared/http/file';
import { HttpResponse } from '@/shared/http/httpResponse';

class UsersController {
    constructor(private userService: UserService) {}

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: UserResponse[] = await this.userService.findAllUser();

            res.status(200).json(findAllUsersData);
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const userResponse: UserResponse = await this.userService.findUserById(userId);

            res.status(200).json(userResponse);
        } catch (error) {
            next(error);
        }
    };

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.userService.createUser(userData);

            res.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.userService.updateUser(userId, userData);

            res.status(200).json(userResponse);
        } catch (error) {
            next(error);
        }
    };

    public updateUserProfilePicture = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const file = new File(req.file);
            const userResponse: UserResponse = await this.userService.updateUserProfilePicture(req.userId, file);

            return HttpResponse.ok(res, userResponse);
        } catch (error) {
            next(error);
        }
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            await this.userService.deleteUser(userId);

            res.status(200).json({ userId });
        } catch (error) {
            next(error);
        }
    };
}

export default UsersController;
