import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import AuthService from '@/modules/auth/service/auth.service';
import AuthController from '@/modules/auth/api/auth.controller';
import AuthRoutes from '@/modules/auth/api/auth.routes';
import UserService from '@/modules/users/service/users.service';
import { NoopStorageService } from '@/shared/storage/noopStorage';

export class AuthModule extends Module {
    public routes: Routes;

    protected setup() {
        const repository = new UserRepository(this.databaseConnection);
        const storageService = new NoopStorageService();
        const authService = new AuthService(repository, storageService);
        const userService = new UserService(repository, storageService);
        const controller = new AuthController(authService, userService);
        this.routes = new AuthRoutes(controller, repository);
    }
}
