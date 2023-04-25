import { BigNumber, Contract as EthersContract, ethers } from 'ethers';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';

export abstract class BlockchainContract {
    public constructor(protected contract: EthersContract) {}

    public address() {
        return this.contract.address;
    }

    public signer(): Signer {
        return this.contract.signer;
    }

    public provider(): Provider {
        return this.contract.provider;
    }

    public async balance(): Promise<string> {
        console.log('address', this.address());
        const balance = await this.provider().getBalance(this.address());
        return ethers.utils.formatEther(balance);
    }

    public deployTransaction(): TransactionResponse {
        return this.contract.deployTransaction;
    }
}
