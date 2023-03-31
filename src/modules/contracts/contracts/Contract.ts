import { Contract as EthersContract } from 'ethers';

export abstract class Contract {
    protected constructor(protected contract: EthersContract) {}
}
