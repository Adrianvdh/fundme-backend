import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { MongoConnection } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { DetailedProject, Project } from '@/modules/projects/models/project.interface';
import { MongoException } from '@/shared/exceptions/exceptions';
import { Payment } from '@/modules/payments/models/payment.interface';
import { ITransactionRepository } from '@/modules/transactions/repository/ITransactionRepository';

export class TransactionRepository implements ITransactionRepository {
    private readonly payments: mongodb.Collection<Payment>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.payments = (this.databaseConnection as MongoConnection).db.collection<Payment>('payments');
    }

    async findOneById(projectId: string): Promise<DetailedProject> {
        const queryResult = await this.payments.aggregate<DetailedProject>([
            {
                $match: {
                    _id: new ObjectId(projectId),
                },
            },
        ]);

        const result = await queryResult.toArray();
        return result.length === 1 ? result[0] : null;
    }

    async findAll(): Promise<DetailedProject[]> {
        const queryResult = await this.payments.aggregate<DetailedProject>([]);

        return await queryResult.toArray();
    }

    async create(ownerId: string): Promise<Project> {
        const projectDocument = {};
        const result = await this.payments.insertOne(projectDocument);
        if (!result.insertedId) {
            throw new MongoException('Failed to save the project!');
        }
        return await this.findOneById(result.insertedId.toString());
    }
}
