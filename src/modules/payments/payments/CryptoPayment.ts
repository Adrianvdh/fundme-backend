import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { BaseException } from '@/shared/exceptions/exceptions';
import { TransactionReceipt } from '@ethersproject/abstract-provider';

export class VerificationException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class CryptoPayment {
    private readonly MIN_BLOCK_CONFIRMATIONS = 10;
    private readonly provider: ethers.providers.JsonRpcProvider;

    constructor(private blockchain: Blockchain) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(blockchain));
    }

    public async verify(transactionAddress: string, recipientAddress: string): Promise<TransactionReceipt> {
        const receipt = await this.provider.waitForTransaction(transactionAddress, this.MIN_BLOCK_CONFIRMATIONS);
        const transactionResponse = await this.provider.getTransaction(transactionAddress);

        if (receipt.status === 0) {
            throw new VerificationException(`Transaction verification failed with status "${receipt.status}"`);
        }
        if (receipt.to !== recipientAddress) {
            throw new VerificationException(
                `Transaction recipient dispatch! Excepted "${recipientAddress}" Got "${receipt.to}"`,
            );
        }
        return receipt;
    }
}
