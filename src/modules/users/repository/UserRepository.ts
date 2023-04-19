import * as mongodb from 'mongodb';
import { ObjectId } from 'mongodb';
import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { User, UserDetails, UserPicture } from '@/modules/users/models/users.interface';
import { MongoConnection } from '@/config/databases/mongodb';
import { DatabaseConnection } from '@/config/databases/connection';
import { MongoDict } from '@/config/databases/types';
import { MongoException } from '@/shared/exceptions/exceptions';

export class UserRepository implements IUserRepository {
    private readonly users: mongodb.Collection<User>;

    constructor(private databaseConnection: DatabaseConnection) {
        this.users = (this.databaseConnection as MongoConnection).db.collection<User>('users');
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

    async create(user: UserDetails): Promise<User> {
        const userDocument = {
            displayName: user.displayName,
            email: user.email,
            password: user.password,
            picture: null,
            wallet: user.wallet,
            created: new Date(),
            modified: new Date(),
        };
        const result = await this.users.insertOne(userDocument);
        return await this.findOneById(result.insertedId.toString());
    }

    async updateOne(userId: string, user: User): Promise<User> {
        const update = {
            $set: {
                ...user,
                modified: new Date(),
            },
        };
        return await this.updateUser(userId, update);
    }

    async updateUserPicture(userId: string, user: UserPicture): Promise<User> {
        const update = {
            $set: {
                ...user,
                modified: new Date(),
            },
        };
        return await this.updateUser(userId, update);
    }

    private async updateUser(userId: string, update: MongoDict): Promise<User> {
        const result = await this.users.updateOne({ _id: new ObjectId(userId) }, update);
        if (result.modifiedCount === 0) {
            throw new MongoException('Failed to update the user!');
        }
        return await this.findOneById(userId);
    }

    async deleteOne(userId: string): Promise<void> {
        await this.users.deleteOne({ _id: new ObjectId(userId) });
    }
}
