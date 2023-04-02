import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';
import { Blockchain, ContractType, DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { ContractDeployment, ContractDetails, ContractStatus } from '@/modules/contracts/models/contract.interface';
import { FundMeContract } from '@/modules/contracts/contracts/FundMeContract';
import { WALLET_PRIVATE_KEY } from '@config';
import { ContractConnector } from '@/modules/contracts/contracts/connect/ContractConnector';

export class ContractService {
    constructor(private contractRepository: IContractRepository) {}

    public async deployContract(userId: string) {
        // 1. Save contract options into Mongo
        const options: DeploymentOptions = {
            name: 'The project name',
            description: '',
            onChainUrl: '',
            blockchain: Blockchain.POLYGON,
            contractType: ContractType.ERC1155,
            deployerKeys: {
                public: '',
                private: WALLET_PRIVATE_KEY,
            },
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
            ),
        );

        // 2, Compile contract
        const compiler = new FundMeContractCompiler();
        const compilationDetails = compiler.compile();

        // 3. Store the ABI, in Mongo
        let blockchainContract;
        try {
            const deployer = new ContractDeployer(options, compilationDetails);
            blockchainContract = await deployer.deploy(FundMeContract);
        } catch (e) {
            await this.contractRepository.markAsFailed(modelContract._id.toString(), {
                deployed: false,
                status: ContractStatus.FAILED,
            });
        }

        // 4. Save deploy contract result into Mongo
        await this.contractRepository.updateDeploymentDetails(
            modelContract._id.toString(),
            new ContractDeployment(
                blockchainContract.address(),
                blockchainContract.deployTransaction().hash,
                compilationDetails.abi,
            ),
        );
    }

    public getContract(contractId: string): FundMeContract {
        const connector = new ContractConnector(null);
        return connector.connectReadWrite(FundMeContract);
    }
}
