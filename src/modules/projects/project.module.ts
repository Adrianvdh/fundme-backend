import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import ProjectRoutes from '@/modules/projects/api/project.routes';
import ProjectController from '@/modules/projects/api/project.controller';
import ProjectService from '@/modules/projects/service/project.service';
import { ProjectRepository } from '@/modules/projects/repository/ProjectRepository';
import { NoopStorageService } from '@/shared/storage/noopStorage';
import { DatabaseConnection } from '@/config/databases/connection';
import { contractServiceFactory } from '@/modules/contracts';

export function projectServiceFactory(databaseConnection: DatabaseConnection): {
    projectService: ProjectService;
    projectRepository: ProjectRepository;
    userRepository: UserRepository;
} {
    const projectRepository = new ProjectRepository(databaseConnection);
    // Contract Service
    const { contractService, userRepository } = contractServiceFactory(databaseConnection);
    // Project Service
    const projectService = new ProjectService(projectRepository, contractService, new NoopStorageService());
    return { projectService, projectRepository, userRepository };
}

export class ProjectModule extends Module {
    public routes: Routes;

    protected setup() {
        const { userRepository, projectRepository, projectService } = projectServiceFactory(this.databaseConnection);
        const projectController = new ProjectController(projectService);

        this.routes = new ProjectRoutes(projectController, projectRepository, userRepository);
    }
}
