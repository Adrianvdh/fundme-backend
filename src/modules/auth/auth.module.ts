import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import AuthService from '@/modules/auth/service/auth.service';
import AuthController from '@/modules/auth/api/auth.controller';
import AuthRoutes from '@/modules/auth/api/auth.routes';

export class AuthModule extends Module {
    public routes: Routes;

    protected setup() {
        const repository = new UserRepository(this.databaseConnection);
        const service = new AuthService(repository);
        const controller = new AuthController(service);
        this.routes = new AuthRoutes(controller, repository);
    }
}
