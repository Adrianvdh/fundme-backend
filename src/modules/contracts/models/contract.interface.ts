import { ObjectId } from 'mongodb';
import { Blockchain, ContractType } from '@/modules/contracts/contracts/model/contract.model';

export interface Contract {
    _id?: ObjectId;

    // Details
    ownerId: ObjectId;
    name: string;
    description: string;
    status: ContractStatus;
    onChainUrl: string;
    deployed: boolean;

    // Deployment details
    contractAddress: string;
    transactionHash: string;
    blockchain: Blockchain;
    contractType: ContractType;
    abi: string;
    keys: {
        private: string;
        public: string;
    };

    // Meta
    version: string;
    createdOn: Date;
    updatedOn: Date;
}

export type IContractDetails = Pick<
    Contract,
    | 'ownerId'
    | 'name'
    | 'description'
    | 'onChainUrl'
    | 'blockchain'
    | 'contractType'
    | 'keys'
    | 'status'
    | 'deployed'
    | 'createdOn'
    | 'updatedOn'
>;

export class ContractDetails implements IContractDetails {
    public ownerId: ObjectId;

    constructor(
        ownerId: string,
        public name: string,
        public description: string,
        public onChainUrl: string,
        public blockchain: Blockchain,
        public contractType: ContractType,
        public keys: { private: string; public: string },
        public status: ContractStatus,
        public deployed: boolean,
        public createdOn: Date,
        public updatedOn: Date,
    ) {
        this.ownerId = new ObjectId(ownerId);
    }
}

export type IContractDeployment = Pick<Contract, 'contractAddress' | 'transactionHash' | 'abi'>;

export type IContractConnectorDetails = Pick<Contract, 'contractAddress' | 'abi' | 'keys'>;

export class ContractDeployment implements IContractDeployment {
    constructor(public contractAddress: string, public transactionHash: string, public abi: string) {}
}

export enum ContractStatus {
    PENDING = 'PENDING',
    DEPLOYED = 'DEPLOYED',
    FAILED = 'FAILED',
    PROCESSING = 'PROCESSING',
}
