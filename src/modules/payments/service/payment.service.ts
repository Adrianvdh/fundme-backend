import { IPaymentRepository } from '@/modules/payments/repository/IPaymentRepository';
import {
    InitializePaymentRequest,
    mapDetailedPaymentToPaymentResponse,
    PaymentResponse,
    VerifyPaymentRequest,
} from '@/modules/payments/api/payment.model';
import { CryptoPayment } from '@/modules/payments/payments/CryptoPayment';
import { TransactionGenerator } from '@/modules/payments/transactions/TransactionGenerator';
import { isEmpty } from '@/shared/utils/util';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import { DetailedPayment } from '@/modules/payments/models/payment.interface';
import { ObjectId } from 'mongodb';

class PaymentService {
    constructor(private paymentRepository: IPaymentRepository) {}

    public async findAllPayments(): Promise<PaymentResponse[]> {
        const mappedPayments = (await this.paymentRepository.findAll()).map(payment =>
            mapDetailedPaymentToPaymentResponse(payment),
        );
        return await Promise.all(mappedPayments);
    }

    public async findPaymentById(paymentId: string): Promise<PaymentResponse> {
        if (isEmpty(paymentId)) {
            throw new ValidationError('Empty request!');
        }

        const payment: DetailedPayment = await this.paymentRepository.findOneById(paymentId);
        if (!payment) {
            throw new NotFound("Project doesn't exist");
        }
        return mapDetailedPaymentToPaymentResponse(payment);
    }

    public async initialisePayment(ownerId: string, requestData: InitializePaymentRequest): Promise<PaymentResponse> {
        const payment = await this.paymentRepository.create(ownerId, {
            value: {
                amount: requestData.amount,
                currency: requestData.currency,
                blockchain: requestData.blockchain,
            },
            paymentProvider: requestData.paymentProvider,
            item: {
                id: new ObjectId(requestData.itemId),
            },
        });
        return mapDetailedPaymentToPaymentResponse(payment);
    }

    public async verifyPayment(paymentId: string, requestData: VerifyPaymentRequest): Promise<PaymentResponse> {
        const payment = new CryptoPayment(null);
        const transactions = new TransactionGenerator().generateTransactions(null);

        return undefined;
    }
}

export default PaymentService;
