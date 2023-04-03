import { IContractDeployer } from '@/modules/contracts/contracts/deploy/IContractDeployer';
import { Contract as EthersContract, ContractFactory, ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { Fees, GasFee } from '@/modules/contracts/contracts/deploy/fees/GasFee';
import { Wallet } from '@/modules/contracts/contracts/deploy/wallet/Wallet';
import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';
import { BaseException } from '@/shared/exceptions/exceptions';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { Constructable } from '@/shared/types';

export class ContractDeploymentException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class ContractDeployer implements IContractDeployer {
    async deploy<T extends BlockchainContract>(
        ContractType: Constructable<T>,
        options: DeploymentOptions,
        contractSource: CompilationDetails,
    ): Promise<T> {
        const provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(options.blockchain));
        const contractDeployerSigner = new ethers.Wallet(options.deployerKeys.private, provider);

        const contractFactory = new ContractFactory(
            contractSource.abi,
            contractSource.byteCode,
            contractDeployerSigner,
        );
        const deployTransactionRequest = await contractFactory.getDeployTransaction(options.onChainUrl);

        const gasFee = new GasFee(options.blockchain, provider, deployTransactionRequest);
        const maxFees = await gasFee.determineMaxFees();
        const estimateGasFee = await gasFee.estimateGasFee(maxFees);

        const wallet = new Wallet(contractDeployerSigner);
        wallet.ensureHasSufficientFunds(estimateGasFee);

        const contract = await this.doDeploy(contractFactory, options, maxFees);
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
