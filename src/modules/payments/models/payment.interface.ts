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

export enum PaymentType {
    FUND = 'FUND',
    WITHDRAWAL = 'WITHDRAWAL',
}

export interface PaymentItem {
    id: ObjectId;
    type: 'PROJECT';
}

export interface Payment {
    _id?: ObjectId;
    ownerId: ObjectId;
    status: PaymentStatus;
    failReason?: string;
    paymentProvider: PaymentProvider;
    paymentType: PaymentType;
    value: MonetaryAmount;
    transactionIds: Array<ObjectId>;
    item: PaymentItem;
    initiated: Date;
    verified?: Date;
}

export type InitialPayment = Pick<Payment, 'value' | 'paymentProvider' | 'paymentType' | 'item'>;

export type PaymentVerified = Pick<Payment, 'transactionIds' | 'status'>;

export type FailedPayment = Pick<Payment, 'status' | 'failReason'>;

export type DetailedPayment = Payment & {
    owner?: DisplayableUser;
    transactions?: Array<DisplayableTransaction>;
};

export interface Transaction {
    _id?: ObjectId;
    paymentId: ObjectId;
    item: PaymentItem;
    source: {
        id: ObjectId;
        type: 'USER' | 'CONTRACT';
    };
    destination: {
        id: ObjectId;
        type: 'USER' | 'CONTRACT';
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
    createdOn: Date;
    updatedOn: Date;
}

export interface TransactionResult {
    transactionIds: ObjectId[];
}

export type TransactionType = 'FEE' | 'PAYMENT' | 'WITHDRAWAL';

export type DisplayableTransaction = Pick<
    Transaction,
    | '_id'
    | 'paymentId'
    | 'item'
    | 'source'
    | 'destination'
    | 'direction'
    | 'description'
    | 'payment'
    | 'type'
    | 'createdOn'
    | 'updatedOn'
>;
