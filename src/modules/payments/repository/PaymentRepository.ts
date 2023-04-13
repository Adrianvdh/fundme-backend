import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { MongoException } from '@/shared/exceptions/exceptions';
import { IPaymentRepository } from '@/modules/payments/repository/IPaymentRepository';
import {
    DetailedPayment,
    FailedPayment,
    InitialPayment,
    Payment,
    PaymentStatus,
    PaymentVerified,
} from '@/modules/payments/models/payment.interface';
import { paymentProjectionFactory } from '@/modules/payments/repository/PaymentProjections';
import { MongoDict } from '@/config/databases/types';

export class PaymentRepository implements IPaymentRepository {
    private readonly payments: mongodb.Collection<Payment>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.payments = (this.databaseConnection as MongoConnection).db.collection<Payment>('payments');
    }

    async findOneById(paymentId: string): Promise<DetailedPayment> {
        const queryResult = await this.payments.aggregate<DetailedPayment>([
            {
                $match: {
                    _id: new ObjectId(paymentId),
                },
            },
            ...paymentProjectionFactory(true, true),
        ]);

        const result = await queryResult.toArray();
        return result.length === 1 ? result[0] : null;
    }

    async findAll(): Promise<DetailedPayment[]> {
        const queryResult = await this.payments.aggregate<DetailedPayment>(paymentProjectionFactory());

        return await queryResult.toArray();
    }

    async create(ownerId: string, payment: InitialPayment): Promise<DetailedPayment> {
        const paymentDocument = {
            ownerId: new ObjectId(ownerId),
            status: PaymentStatus.INITIATED,
            paymentProvider: payment.paymentProvider,
            value: payment.value,
            transactionIds: [],
            item: {
                id: new ObjectId(payment.item.id),
                type: payment.item.type,
            },
            initiated: new Date(),
        };
        const result = await this.payments.insertOne(paymentDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the payment!');
        }
        return await this.findOneById(result.insertedId.toString());
    }

    async markAsFailed(paymentId: string, payment: FailedPayment): Promise<DetailedPayment> {
        const update = {
            $set: {
                ...payment,
                verified: new Date(),
            },
        };
        return await this.updatePayment(paymentId, update);
    }

    async updateVerificationState(paymentId: string, payment: PaymentVerified): Promise<DetailedPayment> {
        const update = {
            $set: {
                ...payment,
                verified: new Date(),
            },
        };
        return await this.updatePayment(paymentId, update);
    }

    private async updatePayment(paymentId: string, update: MongoDict): Promise<DetailedPayment> {
        const result = await this.payments.updateOne({ _id: new ObjectId(paymentId) }, update);
        if (result.modifiedCount === 0) {
            throw new MongoException('Failed to update the payment!');
        }
        return await this.findOneById(paymentId);
    }
}
