import { ObjectId } from 'mongodb';
import { DisplayableUser } from '@/modules/users/models/users.interface';
import { Blockchain } from '@/shared/blockchain/model/blockchain.model';

export enum Currency {
    XDAI = 'XDAI',
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
    type: 'PROJECT';
}

export type TransactionType = 'FEE' | 'PAYMENT' | 'WITHDRAWAL';

export interface Payment {
    _id?: ObjectId;
    ownerId: ObjectId;
    status: PaymentStatus;
    failReason?: string;
    paymentProvider: PaymentProvider;
    value: MonetaryAmount;
    transactionIds: Array<ObjectId>;
    item: PaymentItem;
    initiated: Date;
    verified?: Date;
}

export type InitialPayment = Pick<Payment, 'value' | 'paymentProvider' | 'item'>;

export type PaymentVerified = Pick<Payment, 'transactionIds' | 'status'>;

export type FailedPayment = Pick<Payment, 'status' | 'failReason'>;

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
