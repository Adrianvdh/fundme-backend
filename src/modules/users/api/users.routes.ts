import { Router } from 'express';
import UsersController from '@/modules/users/api/users.controller';
import { Routes } from '@/shared/framework/routes.interface';
import validationMiddleware from '@/shared/http/middlewares/validation.middleware';
import authMiddleware from '@/modules/auth/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { CreateUserRequest } from '@/modules/users/api/users.model';

class UsersRoutes implements Routes {
    public path = '/users';
    public router = Router();

    constructor(private usersController: UsersController, private userRepository: UserRepository) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.usersController.getUsers);
        this.router.get(`${this.path}/:id`, this.usersController.getUserById);
        this.router.post(`${this.path}`, validationMiddleware(CreateUserRequest, 'body'), this.usersController.createUser);
        this.router.put(`${this.path}/:id`, validationMiddleware(CreateUserRequest, 'body', true), this.usersController.updateUser);
        this.router.delete(`${this.path}/:id`, authMiddleware(this.userRepository), this.usersController.deleteUser);
    }
}

export default UsersRoutes;
