import { PaymentItem } from '@/modules/payments/models/payment.interface';

export interface IPaymentResolver {
    resolve(item: PaymentItem): Promise<any>;
}
