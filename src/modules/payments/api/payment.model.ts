import {
    Currency,
    DetailedPayment,
    MonetaryAmount,
    PaymentItem,
    PaymentProvider,
    PaymentStatus,
    TransactionType
} from '@/modules/payments/models/payment.interface';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { IsEnum, IsMongoId, IsNumberString, IsString } from 'class-validator';

export class InitializePaymentRequest {
    @IsNumberString()
    amount: number;

    @IsEnum(Currency)
    currency: Currency;

    @IsEnum(Blockchain)
    blockchain: Blockchain;

    @IsEnum(PaymentProvider)
    paymentProvider: PaymentProvider;

    @IsMongoId()
    itemId: string;

    @IsString()
    itemType: string;
}

export class VerifyPaymentRequest {}

export interface PaymentResponse {
    _id?: string;
    ownerId: string;
    status: PaymentStatus;
    value: MonetaryAmount;
    transactions: TransactionResponse[];
    item: PaymentItem;
    timestamp: string;
}

export interface TransactionResponse {
    _id?: string;
    paymentId: string;
    source: {
        userId: string;
    };
    destination: {
        userId: string;
    };
    direction: 'IN' | 'OUT';
    description: string;
    payment: {
        amount: number;
        currency: Currency;
        externalTransaction: string;
        paymentProvider: PaymentProvider;
    };
    type: TransactionType;
    createdOn: string;
    updatedOn: string;
}

export async function mapDetailedPaymentToPaymentResponse(payment: DetailedPayment): Promise<PaymentResponse> {
    if (!payment) {
        return undefined;
    }
    return {
        _id: payment._id.toString(),
        ownerId: payment.ownerId.toString(),
        status: payment?.status,
        value: payment?.value,
        transactions: [],
        item: payment?.item,
        timestamp: payment?.timestamp?.toISOString(),
    };
}
