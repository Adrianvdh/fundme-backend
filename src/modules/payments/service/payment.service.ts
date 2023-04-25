import { IPaymentRepository } from '@/modules/payments/repository/IPaymentRepository';
import {
    InitializePaymentRequest,
    mapDetailedPaymentToPaymentResponse,
    PaymentResponse,
    VerifyPaymentRequest
} from '@/modules/payments/api/payment.model';
import { CryptoPayment } from '@/modules/payments/payments/CryptoPayment';
import { isEmpty } from '@/shared/utils/util';
import { NotFound, ValidationError } from '@/shared/exceptions/exceptions';
import {
    DetailedPayment,
    PaymentProvider,
    PaymentStatus,
    PaymentType
} from '@/modules/payments/models/payment.interface';
import { ObjectId } from 'mongodb';
import ProjectService from '@/modules/projects/service/project.service';
import TransactionService from '@/modules/payments/transactions/transaction.service';

class PaymentService {
    constructor(
        private paymentRepository: IPaymentRepository,
        private transactionService: TransactionService,
        private projectService: ProjectService,
    ) {}

    public async findAllPayments(): Promise<PaymentResponse[]> {
        const mappedPayments = (await this.paymentRepository.findAll()).map(payment =>
            mapDetailedPaymentToPaymentResponse(payment, this.projectService),
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
        return mapDetailedPaymentToPaymentResponse(payment, this.projectService);
    }

    public async initialisePayment(ownerId: string, requestData: InitializePaymentRequest): Promise<PaymentResponse> {
        const payment = await this.paymentRepository.create(ownerId, {
            value: {
                amount: requestData.amount,
                currency: requestData.currency,
                blockchain: requestData.blockchain,
            },
            paymentProvider: requestData.paymentProvider,
            paymentType: requestData.paymentType,
            // TODO Create item resolver to get the project contract details and return in response
            item: {
                id: new ObjectId(requestData.itemId),
                type: requestData.itemType,
            },
        });
        return mapDetailedPaymentToPaymentResponse(payment, this.projectService);
    }

    // TODO Refactor verify code to be cleaner
    /**
     * Verify crypto payment.
     * 1. Verify payment to projectContractAddress
     * 2. Verify payment to projectOwnerAddress
     * @param paymentId
     * @param requestData
     */
    public async verifyPayment(paymentId: string, requestData: VerifyPaymentRequest): Promise<PaymentResponse> {
        const payment = await this.paymentRepository.findOneById(paymentId);
        if (payment.status === PaymentStatus.PAID) {
            return mapDetailedPaymentToPaymentResponse(payment, this.projectService);
        }
        let contractAddress: string;
        const projectId = payment.item.id.toString();
        if (payment.paymentType === PaymentType.FUND) {
            contractAddress = await this.projectService.getProjectContractAddress(projectId);
        }
        if (payment.paymentType === PaymentType.WITHDRAWAL) {
            contractAddress = await this.projectService.getProjectOwnerAddress(projectId);
        }
        if (payment.paymentProvider === PaymentProvider.EXTERNAL_WALLET) {
            try {
                const verifiablePayment = new CryptoPayment(payment.value.blockchain);
                await verifiablePayment.verify(requestData.transactionAddress, contractAddress, payment.value);
            } catch (e) {
                const updatedPayment = await this.paymentRepository.markAsFailed(paymentId, {
                    status: PaymentStatus.FAILED,
                    failReason: e.message,
                });
                return mapDetailedPaymentToPaymentResponse(updatedPayment, this.projectService);
            }
        } else {
            throw new ValidationError('Payment provider not supported!');
        }
        const { transactionIds } = await this.transactionService.saveFundTransactions(
            payment,
            requestData.transactionAddress,
            contractAddress,
        );
        const updatedPayment = await this.paymentRepository.updateVerificationState(payment._id.toString(), {
            transactionIds,
            status: PaymentStatus.PAID,
        });
        return mapDetailedPaymentToPaymentResponse(updatedPayment, this.projectService);
    }
}

export default PaymentService;
