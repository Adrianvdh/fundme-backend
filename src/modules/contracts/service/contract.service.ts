import { IContractRepository } from '@/modules/contracts/repository/IContractRepository';
import { FundMeContractCompiler } from '@/modules/contracts/contracts/lib/compile/FundMeContractCompiler';
import { ContractDeployer } from '@/modules/contracts/contracts/deploy/ContractDeployer';
import { Blockchain, ContractType } from '@/modules/contracts/contracts/model/contract.model';
import { ContractDeployment, ContractDetails, ContractStatus } from '@/modules/contracts/models/contract.interface';
import { FundMeContract } from '@/modules/contracts/contracts/FundMeContract';
import { WALLET_PRIVATE_KEY } from '@config';
import { ContractConnector } from '@/modules/contracts/contracts/connect/ContractConnector';

export class ContractService {
    constructor(private contractRepository: IContractRepository) {}

    public async deployContract(userId: string) {
        // 1. Save contract options into Mongo
        const options = {
            name: 'The project name',
            description: '',
            onChainUrl: '',
            blockchain: Blockchain.XDAI,
            contractType: ContractType.ERC1155,
            deployerKeys: {
                // Ganache Account #2
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
        const deployer = new ContractDeployer(options, compilationDetails);
        const blockchainContract = await deployer.deploy(FundMeContract);

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
