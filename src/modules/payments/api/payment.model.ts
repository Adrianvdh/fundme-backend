import {
    Currency,
    DetailedPayment,
    MonetaryAmount,
    PaymentProvider,
    PaymentStatus, PaymentType,
    TransactionType
} from '@/modules/payments/models/payment.interface';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { IsEnum, IsMongoId, IsNumberString, IsString } from 'class-validator';
import { ProjectResponse } from '@/modules/projects/api/project.model';
import { ProjectPaymentResolver } from '@/modules/projects/service/ProjectPaymentResolver';
import ProjectService from '@/modules/projects/service/project.service';
import {
    mapDisplayableTransactionToTransactionResponse,
    TransactionResponse,
} from '@/modules/payments/api/transactions.model';

export class InitializePaymentRequest {
    @IsNumberString()
    amount: number;

    @IsEnum(Currency)
    currency: Currency;

    @IsEnum(Blockchain)
    blockchain: Blockchain;

    @IsEnum(PaymentProvider)
    paymentProvider: PaymentProvider;

    @IsEnum(PaymentType)
    paymentType: PaymentType;

    @IsMongoId()
    itemId: string;

    @IsString()
    itemType: 'PROJECT';
}

export class VerifyPaymentRequest {
    @IsString()
    transactionAddress: string;
}

export interface PaymentResponse {
    _id?: string;
    ownerId: string;
    status: PaymentStatus;
    failReason?: string;
    value: MonetaryAmount;
    transactions: TransactionResponse[];
    item: ProjectResponse; // TODO or any other type
    initiated: string;
    verified: string;
}

export async function mapDetailedPaymentToPaymentResponse(
    payment: DetailedPayment,
    projectService: ProjectService,
): Promise<PaymentResponse> {
    if (!payment) {
        return undefined;
    }
    const mappedTransactions = payment?.transactions?.map(
        async transaction => await mapDisplayableTransactionToTransactionResponse(transaction),
    );
    const transactions = mappedTransactions ? await Promise.all(mappedTransactions) : [];
    return {
        _id: payment._id.toString(),
        ownerId: payment.ownerId.toString(),
        status: payment?.status,
        failReason: payment?.failReason,
        value: payment?.value,
        transactions: transactions,
        item: await new ProjectPaymentResolver(projectService).resolve(payment?.item),
        initiated: payment?.initiated?.toISOString(),
        verified: payment?.verified?.toISOString(),
    };
}
