import { Router } from 'express';

export abstract class Routes {
    path?: string;
    public router: Router;

    protected constructor() {
        this.router = Router({
            strict: true,
        });
    }
}
