import IndexController from '@/modules/index/api/index.controller';
import { Routes } from '@/shared/framework/routes.interface';

class IndexRoutes extends Routes {
    public path = '/';

    constructor(private indexController: IndexController) {
        super();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.indexController.index);
    }
}

export default IndexRoutes;
