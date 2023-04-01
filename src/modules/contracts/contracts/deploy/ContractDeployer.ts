import { IContractDeployer } from '@/modules/contracts/contracts/deploy/IContractDeployer';
import { Contract, ContractFactory, ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { Fees, GasFee } from '@/modules/contracts/contracts/deploy/fees/GasFee';
import { Wallet } from '@/modules/contracts/contracts/deploy/wallet/Wallet';
import { CompilationDetails } from '@/modules/contracts/contracts/lib/compile/ContractCompiler';
import { DeploymentOptions } from '@/modules/contracts/contracts/model/contract.model';

export class ContractDeployer implements IContractDeployer {
    async deploy(options: DeploymentOptions, contractSource: CompilationDetails): Promise<Contract> {
        const rpcProvider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(options.blockchain));
        const contractDeployerSigner = new ethers.Wallet(options.deployerKeys.private, rpcProvider);
        const contractFactory = new ContractFactory(
            contractSource.abi,
            contractSource.byteCode,
            contractDeployerSigner,
        );
        const deployTransactionRequest = await contractFactory.getDeployTransaction(options.onChainUrl);
        const gasFee = new GasFee(options.blockchain, rpcProvider, deployTransactionRequest);
        const maxFees = await gasFee.determineMaxFees();
        const estimateGasFee = await gasFee.estimateGasFee(maxFees);

        const wallet = new Wallet(contractDeployerSigner);
        wallet.ensureHasSufficientFunds(estimateGasFee);

        const contract = await this.doDeploy(contractFactory, options, maxFees);
        return await contract.deployed();
    }

    private async doDeploy(
        contractFactory: ContractFactory,
        options: DeploymentOptions,
        maxFees: Fees,
    ): Promise<Contract> {
        try {
            return await contractFactory.deploy(options.onChainUrl, {
                maxFeePerGas: maxFees.maxFeePerGas,
                maxPriorityFeePerGas: maxFees.maxPriorityFeePerGas,
                gasLimit: 6000000,
            });
        } catch (e) {
            console.log(e);
        }
    }
}
