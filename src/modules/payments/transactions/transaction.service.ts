import { ITransactionRepository } from '@/modules/payments/repository/ITransactionRepository';
import { TransactionGenerator } from '@/modules/payments/transactions/TransactionGenerator';
import { Payment, TransactionResult } from '@/modules/payments/models/payment.interface';

class TransactionService {
    constructor(private transactionRepository: ITransactionRepository) {}

    async saveFundTransactions(
        payment: Payment,
        transactionHash: string,
        contractAddress: string,
    ): Promise<TransactionResult> {
        const rawTransactions = new TransactionGenerator().generateFundDepositTransactions(
            payment,
            transactionHash,
            contractAddress,
        );
        const savedTransactions = await this.transactionRepository.saveBatch(payment._id.toString(), rawTransactions);
        const transactionIds = savedTransactions.map(t => t._id);
        return { transactionIds };
    }
}

export default TransactionService;
