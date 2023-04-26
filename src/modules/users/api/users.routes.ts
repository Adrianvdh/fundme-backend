import UsersController from '@/modules/users/api/users.controller';
import { Routes } from '@/shared/framework/routes.interface';
import validated from '@/shared/http/middlewares/validate-body.middleware';
import authMiddleware from '@/modules/auth/middleware/auth.middleware';
import authenticated from '@/modules/auth/middleware/auth.middleware';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { CreateUserRequest } from '@/modules/users/api/users.model';
import { singleFileUpload } from '@/shared/http/middlewares/file.middleware';

class UsersRoutes extends Routes {
    public path = '/users';

    constructor(private usersController: UsersController, private userRepository: UserRepository) {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authenticated(this.userRepository), this.usersController.getUsers);
        this.router.get(`${this.path}/:id`, this.usersController.getUserById);
        this.router.post(`${this.path}`, validated(CreateUserRequest, 'body'), this.usersController.createUser);
        this.router.put(
            `${this.path}/:id/profile-picture`,
            authenticated(this.userRepository),
            singleFileUpload(),
            this.usersController.updateUserProfilePicture,
        );
        this.router.put(
            `${this.path}/:id`,
            authenticated(this.userRepository),
            validated(CreateUserRequest, 'body', true),
            this.usersController.updateUser,
        );
        this.router.delete(`${this.path}/:id`, authMiddleware(this.userRepository), this.usersController.deleteUser);
    }
}

export default UsersRoutes;
