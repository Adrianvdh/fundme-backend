import {
    DetailedPayment,
    FailedPayment,
    InitialPayment,
    PaymentVerified,
} from '@/modules/payments/models/payment.interface';

export interface IPaymentRepository {
    findOneById(paymentId: string): Promise<DetailedPayment>;

    findAll(): Promise<DetailedPayment[]>;

    create(ownerId: string, payment: InitialPayment): Promise<DetailedPayment>;

    updateVerificationState(paymentId: string, payment: PaymentVerified): Promise<DetailedPayment>;

    markAsFailed(paymentId: string, payment: FailedPayment): Promise<DetailedPayment>;
}
