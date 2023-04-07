import { ObjectId } from 'mongodb';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { ContractType } from '@/modules/contracts/contracts/model/contract.model';

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
    blockchain: Blockchain;
    contractType: ContractType;
    keys: {
        private: string;
        public: string;
    };
    contractAddress: string;
    transactionHash: string;
    abi: string;

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
    | 'status'
    | 'onChainUrl'
    | 'deployed'
    | 'blockchain'
    | 'contractType'
    | 'keys'
    | 'version'
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
        public status: ContractStatus = ContractStatus.PENDING,
        public deployed = false,
        public createdOn = new Date(),
        public updatedOn = new Date(),
        public version = '1.0.0',
    ) {
        this.ownerId = new ObjectId(ownerId);
    }
}

export type IContractDeployment = Pick<Contract, 'contractAddress' | 'transactionHash' | 'abi' | 'status'>;

export class ContractDeployment implements IContractDeployment {
    constructor(
        public contractAddress: string,
        public transactionHash: string,
        public abi: string,
        public status: ContractStatus = ContractStatus.DEPLOYED,
        public updatedOn = new Date(),
    ) {}
}

export enum ContractStatus {
    PENDING = 'PENDING',
    DEPLOYED = 'DEPLOYED',
    FAILED = 'FAILED',
    PROCESSING = 'PROCESSING',
}

export type DisplayableContract = Pick<
    Contract,
    | '_id'
    | 'ownerId'
    | 'name'
    | 'description'
    | 'status'
    | 'deployed'
    | 'blockchain'
    | 'contractType'
    | 'contractAddress'
    | 'transactionHash'
    | 'version'
    | 'createdOn'
    | 'updatedOn'
>;
