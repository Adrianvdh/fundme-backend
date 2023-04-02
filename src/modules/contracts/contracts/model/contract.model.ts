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

export type WalletKeys = {
    public: string;
    private: string;
};

export enum Blockchain {
    XDAI = 'XDAI',
    POLYGON = 'POLYGON',
}

export enum ContractType {
    ERC1155 = 'ERC1155',
}
