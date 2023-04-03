import { Routes } from '@/shared/framework/routes.interface';
import { DatabaseConnection } from '@/config/databases/connection';

export abstract class Module {
    public routes: Routes;
    public routerEnabled = true;

    public constructor(protected databaseConnection: DatabaseConnection) {
        this.setup(databaseConnection);
    }

    protected abstract setup(databaseConnection: DatabaseConnection);
}
