import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { ContractType } from '@/modules/contracts/contracts/model/contract.model';
import { ContractStatus, DisplayableContract } from '@/modules/contracts/models/contract.interface';

export interface ContractResponse {
    _id?: string;
    ownerId: string;
    name: string;
    description: string;
    status: ContractStatus;
    deployed: boolean;
    // Deployment details
    blockchain: Blockchain;
    contractType: ContractType;
    contractAddress: string;
    abi: string;
    balance?: string;
    transactionHash: string;
    // Meta
    version: string;
    createdOn: string;
    updatedOn: string;
}

export function mapDisplayableContractToContractResponse(
    contract: DisplayableContract,
    balance?: string,
): ContractResponse {
    if (!contract) {
        return undefined;
    }
    return {
        ...contract,
        balance,
        _id: contract._id.toString(),
        ownerId: contract.ownerId.toString(),
        createdOn: contract.createdOn.toISOString(),
        updatedOn: contract.createdOn.toISOString(),
    };
}
