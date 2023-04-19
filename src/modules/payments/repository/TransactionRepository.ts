import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { Transaction } from '@/modules/payments/models/payment.interface';
import { ITransactionRepository } from '@/modules/payments/repository/ITransactionRepository';
import { MongoException } from '@/shared/exceptions/exceptions';

export class TransactionRepository implements ITransactionRepository {
    private readonly transactions: mongodb.Collection<Transaction>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.transactions = (this.databaseConnection as MongoConnection).db.collection<Transaction>('transactions');
    }

    async findAllByPaymentId(paymentId: string): Promise<Transaction[]> {
        const queryResult = await this.transactions.find<Transaction>({
            paymentId: new ObjectId(paymentId),
        });
        return await queryResult.toArray();
    }

    async saveBatch(paymentId: string, transactions: Transaction[]): Promise<Transaction[]> {
        const result = await this.transactions.insertMany(transactions);
        if (!result.insertedIds) {
            throw new MongoException('Failed to save the project!');
        }
        return await this.findAllByPaymentId(paymentId);
    }
}
