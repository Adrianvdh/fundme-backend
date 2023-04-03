import { Blockchain, WalletKeys } from '@/shared/blockchain/model/blockchain.model';

export type DeploymentOptions = {
    name: string;
    description: string;
    onChainUrl: string;
    blockchain: Blockchain;
    contractType: ContractType;
    deployerKeys: WalletKeys;
};

export type ContractConnectorDetails = {
    blockchain: Blockchain;
    contractAddress: string;
    abi: string;
    keys: WalletKeys;
};


export enum ContractType {
    ERC1155 = 'ERC1155',
}
