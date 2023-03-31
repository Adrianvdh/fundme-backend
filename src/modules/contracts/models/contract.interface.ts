import { ObjectId } from 'mongodb';

export interface Contract {
    _id?: ObjectId;
    abi: string;
    name: string;
    description: string;
    contractAddress: string;
    blockchain: Blockchain;
    keys: {
        private: string;
        public: string;
    };
    version: string;
    onChainName: string;
    onChainSymbol: string;
    contractType: ContractType;
    organizationId: ObjectId;
    createdOn: Date;
    updatedOn: Date;
    deployed: boolean;
    transactionHash: string;
    status: ContractStatus;
}

export type DeploymentOptions = {
    blockchain: Blockchain;
    name: string;
    onChainName: string;
    onChainSymbol: string;
    description: string;
    contractType: ContractType;
};

export enum Blockchain {
    XDAI = 'XDAI',
    POLYGON = 'POLYGON',
}

export enum ContractType {
    ERC1155 = 'ERC1155',
}

export enum ContractStatus {
    PENDING = 'PENDING',
    DEPLOYED = 'DEPLOYED',
    FAILED = 'FAILED',
    PROCESSING = 'PROCESSING',
}
