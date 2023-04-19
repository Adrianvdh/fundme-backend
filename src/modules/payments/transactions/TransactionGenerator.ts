import { Payment, Transaction } from '../models/payment.interface';
import { ObjectId } from 'mongodb';

/**
 * Fund deposit transaction generator
 * TODO: Refactor design to create Fund withdraw transaction generator
 */
export class TransactionGenerator {
    public generateFundDepositTransactions(
        payment: Payment,
        transactionHash: string,
        contractAddress: string,
    ): Transaction[] {
        return [
            this.generateFunderOutTransaction(payment, transactionHash, contractAddress),
            this.generateProjectInTransaction(payment, transactionHash, contractAddress)
        ];
    }

    private generateFunderOutTransaction(
        payment: Payment,
        transactionHash: string,
        contractAddress: string,
    ): Transaction {
        return {
            paymentId: payment._id,
            item: payment.item,
            source: {
                id: new ObjectId(),
                type: 'USER',
            },
            destination: {
                id: new ObjectId(),
                type: 'CONTRACT',
            },
            direction: 'OUT',
            description: '',
            payment: {
                amount: payment.value.amount,
                currency: payment.value.currency,
                paymentProvider: payment.paymentProvider,
                transactionHash: transactionHash,
                contractAddress: contractAddress,
            },
            type: 'PAYMENT',
            createdOn: new Date(),
            updatedOn: new Date(),
        };
    }

    private generateProjectInTransaction(
        payment: Payment,
        transactionHash: string,
        contractAddress: string,
    ): Transaction {
        return {
            paymentId: payment._id,
            item: payment.item,
            source: {
                id: new ObjectId(),
                type: 'USER',
            },
            destination: {
                id: new ObjectId(),
                type: 'CONTRACT',
            },
            direction: 'IN',
            description: `Amount paid to ${payment.item.type} ${payment.item.id}`,
            payment: {
                amount: payment.value.amount,
                currency: payment.value.currency,
                paymentProvider: payment.paymentProvider,
                transactionHash: transactionHash,
                contractAddress: contractAddress,
            },
            type: 'PAYMENT',
            createdOn: new Date(),
            updatedOn: new Date(),
        };
    }
}
