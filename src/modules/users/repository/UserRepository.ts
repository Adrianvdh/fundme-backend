import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { User } from '@/modules/users/models/users.interface';
import { MongoConnection } from '@/config/databases/mongodb';
import { Filter } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';

export class UserRepository implements IUserRepository {
    private readonly users: mongodb.Collection<User>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.users = (this.databaseConnection as MongoConnection).db.collection<User>('users');
    }

    async find(filter: Filter): Promise<User> {
        return await this.users.findOne(filter);
    }

    async findOneById(userId: string): Promise<User> {
        return await this.users.findOne({ _id: new ObjectId(userId) });
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.users.findOne({ email });
    }

    async findAll(): Promise<User[]> {
        return await this.users.find().toArray();
    }

    async create(user: User): Promise<User> {
        const result = await this.users.insertOne(user);
        return { _id: result.insertedId, ...user };
    }

    async updateOne(userId: string, user: User): Promise<User> {
        const update = {
            $set: {
                email: user.email,
            },
        };
        await this.users.updateOne({ _id: new ObjectId(userId) }, update);
        return { _id: new ObjectId(userId), ...user };
    }

    async deleteOne(userId: string): Promise<void> {
        await this.users.deleteOne({ _id: new ObjectId(userId) });
    }
}
