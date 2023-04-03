import { IFundMeContract } from '@/modules/contracts/contracts/IFundMeContract';
import { BlockchainContract } from '@/modules/contracts/contracts/BlockchainContract';
import { ethers } from 'ethers';

export class FundMeBlockchainContract extends BlockchainContract implements IFundMeContract {
    async fund(amount: string) {
        const amountBigNumber = ethers.utils.parseEther(amount);
        await this.contract.fund({ value: amountBigNumber });
    }

    async withdraw(amount: string) {
        const amountBigNumber = ethers.utils.parseEther(amount);
        await this.contract.withdraw({ value: amountBigNumber });
    }

    getFunder(index: number): string {
        return '';
    }

    pause(): void {}

    unpause(): void {}
}
