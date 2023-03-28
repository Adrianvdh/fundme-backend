import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import ProjectRoutes from '@/modules/projects/api/project.routes';
import ProjectController from '@/modules/projects/api/project.controller';
import ProjectService from '@/modules/projects/service/project.service';
import { ProjectRepository } from '@/modules/projects/repository/ProjectRepository';
import { NoopStorageService } from '@/shared/storage/noopStorage';

export class ProjectModule extends Module {
    public routes: Routes;

    protected setup() {
        const userRepository = new UserRepository(this.databaseConnection);
        const projectRepository = new ProjectRepository(this.databaseConnection);
        const service = new ProjectService(projectRepository, new NoopStorageService());
        const controller = new ProjectController(service);
        this.routes = new ProjectRoutes(controller, projectRepository, userRepository);
    }
}
