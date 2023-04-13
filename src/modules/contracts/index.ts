import { DatabaseConnection } from '@/config/databases/connection';
import { ContractService } from '@/modules/contracts/service/contract.service';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { ContractRepository } from '@/modules/contracts/repository/ContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';

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
    return { contractService, contractRepository, userRepository}
}
