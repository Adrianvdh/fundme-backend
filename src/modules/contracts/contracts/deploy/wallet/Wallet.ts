import { BigNumber, Wallet as EthersWallet } from 'ethers';

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
}
