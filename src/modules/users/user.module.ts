import { UserRepository } from '@/modules/users/repository/UserRepository';
import UserService from '@/modules/users/service/users.service';
import UsersController from '@/modules/users/api/users.controller';
import UsersRoutes from '@/modules/users/api/users.routes';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';

export class UserModule extends Module {
    public routes: Routes;

    protected setup() {
        const repository = new UserRepository(this.databaseConnection);
        const service = new UserService(repository);
        const controller = new UsersController(service);
        this.routes = new UsersRoutes(controller, repository);
    }
}
