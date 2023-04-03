export enum Blockchain {
    XDAI = 'XDAI',
    POLYGON = 'POLYGON',
}

export type Wallet = {
    address: string;
    keys: WalletKeys;
};

export type WalletKeys = {
    public: string;
    private: string;
};
