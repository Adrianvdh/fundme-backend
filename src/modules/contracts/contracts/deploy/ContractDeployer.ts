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
        const contractDeployerSigner = new ethers.Wallet('SOME-PRIVATE-KEY', rpcProvider);
        const contractFactory = new ContractFactory(
            contractSource.abi,
            contractSource.byteCode,
            contractDeployerSigner,
        );
        const deployTransactionRequest = contractFactory.getDeployTransaction(
            options.onChainName,
            options.onChainSymbol,
        );
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
        return await contractFactory.deploy(options.onChainName, options.onChainSymbol, {
            maxFeePerGas: maxFees.maxFeePerGas,
            maxPriorityFeePerGas: maxFees.maxPriorityFeePerGas,
            gasLimit: 6000000,
        });
    }
}
