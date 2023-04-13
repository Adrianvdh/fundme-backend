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
import { DetailedPayment, PaymentProvider, PaymentStatus } from '@/modules/payments/models/payment.interface';
import { ObjectId } from 'mongodb';
import { ITransactionRepository } from '@/modules/payments/repository/ITransactionRepository';
import ProjectService from '@/modules/projects/service/project.service';

class PaymentService {
    constructor(
        private paymentRepository: IPaymentRepository,
        private transactionRepository: ITransactionRepository,
        private projectService: ProjectService,
    ) {}

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
                type: requestData.itemType,
            },
        });
        return mapDetailedPaymentToPaymentResponse(payment);
    }

    public async verifyPayment(paymentId: string, requestData: VerifyPaymentRequest): Promise<PaymentResponse> {
        const payment = await this.paymentRepository.findOneById(paymentId);
        // TODO Refactor into paymentitem resolver interface
        const projectContractAddress = await this.projectService.getProjectContractAddress(payment.item.id.toString());

        if (payment.paymentProvider === PaymentProvider.EXTERNAL_WALLET) {
            const verifiablePayment = new CryptoPayment(payment.value.blockchain);
            try {
                await verifiablePayment.verify(requestData.transactionAddress, projectContractAddress, payment.value);
            } catch (e) {
                const updatedPayment = await this.paymentRepository.markAsFailed(paymentId, {
                    status: PaymentStatus.FAILED,
                    failReason: e.message,
                });
                return mapDetailedPaymentToPaymentResponse(updatedPayment);
            }
        } else {
            throw new ValidationError('Payment provider not supported!');
        }
        const rawTransactions = new TransactionGenerator().generateTransactions(payment);
        const savedTransactions = await this.transactionRepository.saveBatch(paymentId, rawTransactions);
        const transactionIds = savedTransactions.map(t => t._id);
        const updatedPayment = await this.paymentRepository.updateVerificationState(paymentId, {
            transactionIds,
            status: PaymentStatus.PAID,
        });
        return mapDetailedPaymentToPaymentResponse(updatedPayment);
    }
}

export default PaymentService;
