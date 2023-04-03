import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { Blockchain, ContractType, DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import {
    Contract,
    ContractDeployment,
    ContractDetails,
    ContractStatus,
} from '@/modules/contracts/models/contract.interface';
import { FundMeBlockchainContract } from '@/modules/contracts/contracts/FundMeBlockchainContract';
import { WALLET_PRIVATE_KEY } from '@config';
import { ContractConnector } from '@/modules/contracts/contracts/connect/ContractConnector';
import { BaseException } from '@/shared/exceptions/exceptions';
import { CompilationDetails, ContractCompiler } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { IContractDeployer } from '@/modules/contracts/contracts/deploy/IContractDeployer';

export class ContractServiceException extends BaseException {
    constructor(message: string, public contract: Contract) {
        super(message);
    }
}

export class ContractService {
    constructor(
        private contractRepository: IContractRepository,
        private compiler: ContractCompiler,
        private deployer: IContractDeployer,
    ) {}

    public async deployContract(userId: string, name: string, description: string): Promise<Contract> {
        // 1. Save contract options into Mongo
        const options = this.deploymentOptions(name, description);
        const modelContract = await this.saveContractDetails(userId, options);

        // 2, Compile contract
        const compilationDetails = this.compileContract();

        // 3. Store the ABI, in Mongo
        const blockchainContract = await this.tryDeployContract(options, compilationDetails, modelContract);

        // 4. Save deploy contract result into Mongo
        return await this.saveDeployedContract(modelContract, blockchainContract, compilationDetails);
    }

    private deploymentOptions(name: string, description: string): DeploymentOptions {
        return {
            name,
            description,
            onChainUrl: '',
            blockchain: Blockchain.POLYGON,
            contractType: ContractType.ERC1155,
            deployerKeys: {
                public: '',
                private: WALLET_PRIVATE_KEY,
            },
        };
    }

    private async saveContractDetails(userId: string, options: DeploymentOptions): Promise<Contract> {
        return await this.contractRepository.create(
            new ContractDetails(
                userId,
                options.name,
                options.description,
                options.onChainUrl,
                options.blockchain,
                options.contractType,
                options.deployerKeys,
            ),
        );
    }

    private compileContract(): CompilationDetails {
        return this.compiler.compile();
    }

    private async saveDeployedContract(
        modelContract: Contract,
        blockchainContract: BlockchainContract,
        compilationDetails: CompilationDetails,
    ): Promise<Contract> {
        return await this.contractRepository.updateDeploymentDetails(
            modelContract._id.toString(),
            new ContractDeployment(
                blockchainContract.address(),
                blockchainContract.deployTransaction().hash,
                compilationDetails.abi,
            ),
        );
    }

    private async tryDeployContract(
        options: DeploymentOptions,
        compilationDetails: CompilationDetails,
        modelContract: Contract,
    ): Promise<BlockchainContract> {
        try {
            return await this.deployer.deploy(FundMeBlockchainContract, options, compilationDetails);
        } catch (e) {
            const contract = await this.contractRepository.markAsFailed(modelContract._id.toString(), {
                deployed: false,
                status: ContractStatus.FAILED,
            });
            throw new ContractServiceException(e.message, contract);
        }
    }

    public async getContract(contractId: string): Promise<FundMeBlockchainContract> {
        const modelContract = await this.contractRepository.findOneById(contractId);
        const connector = new ContractConnector(modelContract);
        return connector.connectReadWrite(FundMeBlockchainContract);
    }
}
