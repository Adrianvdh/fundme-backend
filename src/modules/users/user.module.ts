import { UserRepository } from '@/modules/users/repository/UserRepository';
import UserService from '@/modules/users/service/users.service';
import UsersController from '@/modules/users/api/users.controller';
import UsersRoutes from '@/modules/users/api/users.routes';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import { NoopStorageService } from '@/shared/storage/noopStorage';
import { DatabaseConnection } from '@/config/databases/connection';

export function userServiceFactory(databaseConnection: DatabaseConnection): {
    userService: UserService;
    userRepository: UserRepository;
} {
    const userRepository = new UserRepository(databaseConnection);
    const storageService = new NoopStorageService();
    const userService = new UserService(userRepository, storageService);
    return { userService, userRepository };
}

export class UserModule extends Module {
    public routes: Routes;

    public setup(databaseConnection: DatabaseConnection) {
        const { userService, userRepository } = userServiceFactory(databaseConnection);
        const controller = new UsersController(userService);

        this.routes = new UsersRoutes(controller, userRepository);
    }
}
