import {
    Currency,
    DisplayableTransaction,
    PaymentProvider,
    TransactionType
} from '@/modules/payments/models/payment.interface';
import { ProjectPaymentResolver } from '@/modules/projects/service/ProjectPaymentResolver';
import ProjectService from '@/modules/projects/service/project.service';
import { mapDisplayableUserToUserResponse, UserResponse } from '@/modules/users/api/users.model';
import { DisplayableUser } from '@/modules/users/models/users.interface';
import { IStorageService } from '@/shared/storage/storage';
import { mapFileField } from '@/shared/storage/file.interface';


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
        paymentProvider: PaymentProvider;
        transactionHash: string;
        contractAddress: string;
    };
    type: TransactionType;
    createdOn: string;
    updatedOn: string;
}

export async function mapDisplayableTransactionToTransactionResponse(
    transaction: DisplayableTransaction,
): Promise<TransactionResponse> {
    if (!transaction) {
        return undefined;
    }
    return {
        _id: transaction._id.toString(),
        paymentId: transaction.paymentId.toString(),
        source: {
            userId: transaction.source.id.toString(),
        },
        destination: {
            userId: transaction.destination.id.toString(),
        },
        direction: transaction.direction,
        description: transaction.description,
        payment: {
            amount: transaction.payment.amount,
            currency: transaction.payment.currency,
            paymentProvider: transaction.payment.paymentProvider,
            transactionHash: transaction.payment.transactionHash,
            contractAddress: transaction.payment.contractAddress,
        },
        type: transaction.type,
        createdOn: transaction.createdOn?.toISOString(),
        updatedOn: transaction.updatedOn?.toISOString(),
    };
}
