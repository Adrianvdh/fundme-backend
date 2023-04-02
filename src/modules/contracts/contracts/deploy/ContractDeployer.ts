import { IContractDeployer } from '@/modules/contracts/contracts/deploy/IContractDeployer';
import { Contract as EthersContract, ContractFactory, ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { Fees, GasFee } from '@/modules/contracts/contracts/deploy/fees/GasFee';
import { Wallet } from '@/modules/contracts/contracts/deploy/wallet/Wallet';
import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { BaseException } from '@/shared/exceptions/exceptions';
import { Contract } from '@/modules/contracts/contracts/Contract';
import { Constructable } from '@/shared/types';

export class ContractDeploymentException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class ContractDeployer extends IContractDeployer {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly contractDeployerSigner: ethers.Wallet;

    constructor(protected options: DeploymentOptions, protected contractSource: CompilationDetails) {
        super(options, contractSource);
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(options.blockchain));
        this.contractDeployerSigner = new ethers.Wallet(options.deployerKeys.private, this.provider);
    }

    async deploy<T extends Contract>(ContractType: Constructable<T>): Promise<T> {
        const contractFactory = new ContractFactory(
            this.contractSource.abi,
            this.contractSource.byteCode,
            this.contractDeployerSigner,
        );
        const deployTransactionRequest = await contractFactory.getDeployTransaction(this.options.onChainUrl);

        const gasFee = new GasFee(this.options.blockchain, this.provider, deployTransactionRequest);
        const maxFees = await gasFee.determineMaxFees();
        const estimateGasFee = await gasFee.estimateGasFee(maxFees);

        const wallet = new Wallet(this.contractDeployerSigner);
        wallet.ensureHasSufficientFunds(estimateGasFee);

        const contract = await this.doDeploy(contractFactory, this.options, maxFees);
        return new ContractType(await contract.deployed());
    }

    private async doDeploy(
        contractFactory: ContractFactory,
        options: DeploymentOptions,
        maxFees: Fees,
    ): Promise<EthersContract> {
        try {
            return await contractFactory.deploy(options.onChainUrl, {
                maxFeePerGas: maxFees.maxFeePerGas,
                maxPriorityFeePerGas: maxFees.maxPriorityFeePerGas,
                gasLimit: 6000000,
            });
        } catch (e) {
            throw new ContractDeploymentException(e.message);
        }
    }
}
