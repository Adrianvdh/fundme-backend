import { Transaction } from '@/modules/payments/models/payment.interface';

export interface ITransactionRepository {
    findAllByPaymentId(paymentId: string): Promise<Transaction[]>;

    saveBatch(paymentId: string, transaction: Transaction[]): Promise<Transaction[]>;
}
