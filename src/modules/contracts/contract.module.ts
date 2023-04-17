import { UserRepository } from '@/modules/users/repository/UserRepository';
import { Routes } from '@/shared/framework/routes.interface';
import { Module } from '@/shared/framework/module';
import ProjectRoutes from '@/modules/projects/api/project.routes';
import ProjectController from '@/modules/projects/api/project.controller';
import { DatabaseConnection } from '@/config/databases/connection';
import { ContractService } from '@/modules/contracts/service/contract.service';
import { ContractRepository } from '@/modules/contracts/repository/ContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';
import ContractRoutes from '@/modules/contracts/api/contract.routes';
import ContractController from '@/modules/contracts/api/contract.controller';

export function contractServiceFactory(databaseConnection: DatabaseConnection): {
    contractService: ContractService;
    contractRepository: ContractRepository;
    userRepository: UserRepository;
} {
    const userRepository = new UserRepository(databaseConnection);
    const contractRepository = new ContractRepository(databaseConnection);
    const contractService = new ContractService(
        userRepository,
        contractRepository,
        new FundMeContractCompiler(),
        new ContractDeployer(),
    );
    return { contractService, contractRepository, userRepository };
}

export class ContractModule extends Module {
    public routes: Routes;

    protected setup() {
        const { contractService, userRepository } = contractServiceFactory(this.databaseConnection);
        const contractController = new ContractController(contractService);

        this.routes = new ContractRoutes(contractController, userRepository);
    }
}
