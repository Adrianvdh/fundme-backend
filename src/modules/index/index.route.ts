import { Router } from 'express';
import IndexController from '@/modules/index/api/index.controller';
import { Routes } from '@/shared/framework/routes.interface';

class IndexRoute implements Routes {
    public path = '/';
    public router = Router();

    constructor(private indexController: IndexController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.indexController.index);
    }
}

export default IndexRoute;
