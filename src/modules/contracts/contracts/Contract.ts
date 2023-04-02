import { Contract as EthersContract } from 'ethers';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider';

export abstract class Contract {
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

    public deployTransaction(): TransactionResponse {
        return this.contract.deployTransaction;
    }
}
