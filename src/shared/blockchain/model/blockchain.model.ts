export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    GNOSIS = 'GNOSIS',
}

export enum ChainID {
    // Ethereum
    Ethereum_Mainnet = 1,
    Goerli_Testnet = 5,

    // Gnosis
    Gnosis = 100,
    Chiado_Testnet = 10200,
}

export enum CryptoCurrency {
    // Ethereum
    ETH = 'ETH',
    DAI = 'DAI',

    // Gnosis
    XDAI = 'XDAI',
}

export interface Wallet {
    address: string;
    keys: WalletKeys;
}

export interface WalletKeys {
    public: string;
    private: string;
}
