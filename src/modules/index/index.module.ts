import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import IndexController from '@/modules/index/api/index.controller';
import IndexRoutes from '@/modules/index/api/index.routes';
import { DatabaseConnection } from '@/config/databases/connection';

export class IndexModule extends Module {
    public routes: Routes;

    public setup(databaseConnection: DatabaseConnection) {
        this.routes = new IndexRoutes(new IndexController());
    }
}
