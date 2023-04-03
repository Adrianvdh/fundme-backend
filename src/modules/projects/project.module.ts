import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import ProjectRoutes from '@/modules/projects/api/project.routes';
import ProjectController from '@/modules/projects/api/project.controller';
import ProjectService from '@/modules/projects/service/project.service';
import { ProjectRepository } from '@/modules/projects/repository/ProjectRepository';
import { NoopStorageService } from '@/shared/storage/noopStorage';
import { ContractService } from '@/modules/contracts/service/contract.service';
import { ContractRepository } from '@/modules/contracts/repository/ContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';

export class ProjectModule extends Module {
    public routes: Routes;

    protected setup() {
        const userRepository = new UserRepository(this.databaseConnection);
        const projectRepository = new ProjectRepository(this.databaseConnection);
        const contractRepository = new ContractRepository(this.databaseConnection);
        // Contract Service
        const contractService = new ContractService(
            contractRepository,
            new FundMeContractCompiler(),
            new ContractDeployer(),
        );
        // Project Service
        const projectService = new ProjectService(projectRepository, contractService, new NoopStorageService());
        const projectController = new ProjectController(projectService);

        this.routes = new ProjectRoutes(projectController, projectRepository, userRepository);
    }
}
