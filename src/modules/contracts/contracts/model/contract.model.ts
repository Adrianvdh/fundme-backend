export type DeploymentOptions = {
    name: string;
    description: string;
    onChainName: string;
    onChainSymbol: string;
    blockchain: Blockchain;
    contractType: ContractType;
};

export enum Blockchain {
    XDAI = 'XDAI',
    POLYGON = 'POLYGON',
}

export enum ContractType {
    ERC1155 = 'ERC1155',
}
