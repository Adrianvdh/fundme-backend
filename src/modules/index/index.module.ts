import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import IndexRoute from '@/modules/index/index.route';
import IndexController from '@/modules/index/api/index.controller';

export class IndexModule extends Module {
    public routes: Routes;

    protected setup() {
        this.routes = new IndexRoute(new IndexController());
    }
}
