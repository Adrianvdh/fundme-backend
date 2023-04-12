import { DetailedPayment, InitialPayment } from '@/modules/payments/models/payment.interface';

export interface IPaymentRepository {
    findOneById(paymentId: string): Promise<DetailedPayment>;

    findAll(): Promise<DetailedPayment[]>;

    create(ownerId: string, payment: InitialPayment): Promise<DetailedPayment>;
}
