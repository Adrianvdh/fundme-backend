import { Contract as EthersContract, ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { ContractConnectorDetails } from '@/modules/contracts/contracts/model/contract.model';
import { Contract } from '@/modules/contracts/contracts/Contract';
import { Constructable } from '@/shared/types';
import { IContractConnector } from '@/modules/contracts/contracts/connect/IContractConnector';

export class ContractConnector extends IContractConnector {
    private readonly provider: ethers.providers.JsonRpcProvider;
    private readonly contractDeployerSigner: ethers.Wallet;

    constructor(protected connectorDetails: ContractConnectorDetails) {
        super(connectorDetails);
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(connectorDetails.blockchain));
        this.contractDeployerSigner = new ethers.Wallet(connectorDetails.keys.private, this.provider);
    }

    connectReadonly<T extends Contract>(ContractType: Constructable<T>): T {
        const contract = new EthersContract(
            this.connectorDetails.contractAddress,
            this.connectorDetails.abi,
            this.provider,
        );
        return new ContractType(contract);
    }

    connectReadWrite<T extends Contract>(ContractType: Constructable<T>): T {
        const contract = new EthersContract(
            this.connectorDetails.contractAddress,
            this.connectorDetails.abi,
            this.contractDeployerSigner,
        );
        return new ContractType(contract);
    }
}
