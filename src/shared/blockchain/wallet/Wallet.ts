import { BigNumber, ethers, Wallet as EthersWallet } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { Blockchain, WalletKeys } from '@/shared/blockchain/model/blockchain.model';

export class WalletException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class Wallet {
    constructor(private wallet: EthersWallet) {}

    public async hasSufficientFunds(amount: BigNumber): Promise<boolean> {
        const balance = await this.wallet.getBalance();
        return !balance.sub(amount).lt(0);
    }

    public ensureHasSufficientFunds(amount: BigNumber): void {
        if (!this.hasSufficientFunds(amount)) {
            throw new WalletException("Your wallet doesn't have sufficient funds");
        }
    }

    public keys(): WalletKeys {
        return {
            private: this.wallet.privateKey,
            public: this.wallet.publicKey,
        };
    }

    public address(): string {
        return this.wallet.address;
    }
}

export function createWallet(blockchain: Blockchain) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(blockchain));
    const wallet = EthersWallet.createRandom({ provider });
    return new Wallet(wallet);
}
