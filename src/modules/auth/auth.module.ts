import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import AuthService from '@/modules/auth/service/auth.service';
import AuthController from '@/modules/auth/api/auth.controller';
import AuthRoutes from '@/modules/auth/api/auth.routes';
import UserService from '@/modules/users/service/users.service';
import { NoopStorageService } from '@/shared/storage/noopStorage';
import { DatabaseConnection } from '@/config/databases/connection';

export function authServiceFactory(databaseConnection: DatabaseConnection): {
    authService: AuthService;
    userService: UserService;
    userRepository: UserRepository;
} {
    const userRepository = new UserRepository(databaseConnection);
    const storageService = new NoopStorageService();
    const authService = new AuthService(userRepository, storageService);
    const userService = new UserService(userRepository, storageService);
    return { authService, userService, userRepository };
}

export class AuthModule extends Module {
    public routes: Routes;

    public setup(databaseConnection: DatabaseConnection) {
        const { authService, userService, userRepository } = authServiceFactory(databaseConnection);
        const controller = new AuthController(authService, userService);
        this.routes = new AuthRoutes(controller, userRepository);
    }
}
