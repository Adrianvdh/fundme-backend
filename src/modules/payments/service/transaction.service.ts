import { ITransactionRepository } from '@/modules/payments/repository/ITransactionRepository';

class TransactionService {
    constructor(private transactionRepository: ITransactionRepository) {}
}

export default TransactionService;
