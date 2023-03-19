import { NextFunction, Request, Response } from 'express';
import { User } from '@/modules/users/models/users.interface';
import UserService from '@/modules/users/service/users.service';
import { CreateUserRequest, UserResponse } from '@/modules/users/api/users.model';

class UsersController {
    constructor(private userService: UserService) {}

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: UserResponse[] = await this.userService.findAllUser();

            res.status(200).json({ data: findAllUsersData, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const userResponse: UserResponse = await this.userService.findUserById(userId);

            res.status(200).json({ data: userResponse, message: 'findOne' });
        } catch (error) {
            next(error);
        }
    };

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.userService.createUser(userData);

            res.status(201).json({ data: userResponse, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const userData: CreateUserRequest = req.body;
            const userResponse: UserResponse = await this.userService.updateUser(userId, userData);

            res.status(200).json({ data: userResponse, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            await this.userService.deleteUser(userId);

            res.status(200).json({ data: userId, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}

export default UsersController;
