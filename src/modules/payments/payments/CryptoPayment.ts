import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { ethers } from 'ethers';
import { rpcUrlFromBlockchain } from '@/config/rpc/rpcGateway';
import { BaseException } from '@/shared/exceptions/exceptions';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { Currency, MonetaryAmount } from '@/modules/payments/models/payment.interface';

export class VerificationException extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class CryptoPayment {
    private readonly MIN_BLOCK_CONFIRMATIONS = 5;
    private readonly ROUNDING_DECIMALS = 18;
    private readonly provider: ethers.providers.JsonRpcProvider;

    constructor(private blockchain: Blockchain) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrlFromBlockchain(blockchain));
    }

    /**
     *
     * @param transactionHash
     * @param contractAddress
     * @param monetaryAmount
     */
    public async verify(
        transactionHash: string,
        contractAddress: string,
        monetaryAmount: MonetaryAmount,
    ): Promise<TransactionResponse> {
        const receipt = await this.provider.waitForTransaction(transactionHash, this.MIN_BLOCK_CONFIRMATIONS);
        const transactionResponse = await this.provider.getTransaction(transactionHash);

        if (receipt.status === 0) {
            throw new VerificationException(`Transaction verification failed with status "${receipt.status}"`);
        }
        if (receipt.to !== contractAddress) {
            throw new VerificationException(
                `Transaction recipient dispatch! Excepted "${contractAddress}" Got "${receipt.to}"`,
            );
        }

        if (monetaryAmount.currency === Currency.XDAI) {
            const amountFromOffChainRecords = ethers.utils.parseUnits(
                monetaryAmount.amount.toString(),
                this.ROUNDING_DECIMALS,
            );
            if (!transactionResponse.value.eq(amountFromOffChainRecords)) {
                throw new VerificationException(
                    `Amount mismatch, amountFromOffChainRecords: ${amountFromOffChainRecords.toNumber()}, transaction: ${transactionResponse.value.toNumber()}`,
                );
            }
        }
        return transactionResponse;
    }
}
