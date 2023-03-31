import { IFundMeContract } from '@/modules/contracts/contracts/IFundMeContract';
import { Contract } from '@/modules/contracts/contracts/Contract';
import { ethers } from 'ethers';

export class FundMeContract extends Contract implements IFundMeContract {
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
