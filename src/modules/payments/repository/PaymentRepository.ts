import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { MongoException } from '@/shared/exceptions/exceptions';
import { IPaymentRepository } from '@/modules/payments/repository/IPaymentRepository';
import { DetailedPayment, InitialPayment, Payment, PaymentStatus } from '@/modules/payments/models/payment.interface';
import { paymentProjectionFactory } from '@/modules/payments/repository/PaymentProjections';

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
            },
            timestamp: new Date(),
        };
        const result = await this.payments.insertOne(paymentDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the payment!');
        }
        return await this.findOneById(result.insertedId.toString());
    }
}
