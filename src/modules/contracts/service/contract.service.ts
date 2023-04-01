import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';
import { Blockchain, ContractType } from '@/modules/contracts/contracts/model/contract.model';
import { ContractDeployment, ContractDetails, ContractStatus } from '@/modules/contracts/models/contract.interface';

export class ContractService {
    constructor(private contractRepository: IContractRepository) {}

    public async publishContract(userId: string) {
        // 1. Save contract options into Mongo
        const options = {
            name: 'The project name',
            description: '',
            onChainUrl: '',
            blockchain: Blockchain.XDAI,
            contractType: ContractType.ERC1155,
        };

        const modelContract = await this.contractRepository.create(
            new ContractDetails(
                userId,
                options.name,
                options.description,
                options.onChainUrl,
                options.blockchain,
                options.contractType,
                options.deployerKeys,
                ContractStatus.PENDING,
                false,
                new Date(),
                new Date(),
            ),
        );

        // 2, Compile contract
        const compiler = new FundMeContractCompiler();
        const compilationDetails = compiler.compile();

        // 3. Store the ABI, in Mongo
        const deployer = new ContractDeployer();
        const blockchainContract = await deployer.deploy(options, compilationDetails);

        // 4. Save deploy contract result into Mongo
        await this.contractRepository.updateDeploymentDetails(
            modelContract._id.toString(),
            new ContractDeployment(
                blockchainContract.address,
                blockchainContract.deployTransaction.hash,
                compilationDetails.abi,
            ),
        );
    }
}
