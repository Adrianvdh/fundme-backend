import { ObjectId } from 'mongodb';
import { DisplayableUser } from '@/modules/users/models/users.interface';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';
import { Contract } from '@/modules/contracts/models/contract.interface';

export enum Currency {
    XDAI = 'XDAI',
    MATIC = 'MATIC',
}

export type MonetaryAmount = {
    amount: number;
    currency: Currency;
    blockchain?: Blockchain;
};

export enum PaymentProvider {
    EXTERNAL_WALLET = 'EXTERNAL_WALLET',
}

export enum PaymentStatus {
    INITIATED = 'INITIATED',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export interface PaymentItem {
    id: ObjectId;
}

export type TransactionType = 'FEE' | 'PAYMENT' | 'WITHDRAWAL';

export interface Payment {
    _id?: ObjectId;
    ownerId: ObjectId;
    status: PaymentStatus;
    paymentProvider: PaymentProvider;
    value: MonetaryAmount;
    transactionIds: Array<ObjectId>;
    item: PaymentItem;
    timestamp: Date;
}

export type InitialPayment = Pick<Payment, 'value' | 'paymentProvider' | 'item'>;

export type DetailedPayment = Payment & {
    owner?: DisplayableUser;
    transactions?: Array<DisplayableTransaction>;
};

export interface Transaction {
    _id: ObjectId;
    paymentId: ObjectId;
    source: {
        userId: ObjectId;
    };
    destination: {
        userId: ObjectId;
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
    createdOn: Date;
    updatedOn: Date;
}

export type DisplayableTransaction = Pick<Transaction, '_id'>;
