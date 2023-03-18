import { IUserRepository } from '@/modules/users/repository/IUserRepository';
import { User } from '@/modules/users/models/users.interface';
import * as mongodb from 'mongodb';
import { Filter } from '@/config/databases/types';
import { DatabaseConnection } from '@/config/databases/connection';
import { CreateUserRequest } from '@/modules/users/api/users.model';
import { MongoConnection } from '@/config/databases/mongodb';

export class UserRepository implements IUserRepository {
    private readonly users: mongodb.Collection<User>;

    constructor(databaseConnection: DatabaseConnection) {
        this.users = (databaseConnection as MongoConnection).connection.collection<User>('user');
    }

    create(create: CreateUserRequest): Promise<User> {
        return Promise.resolve(undefined);
    }

    deleteOne(objectId: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    findAll(): Promise<User[]> {
        return Promise.resolve([]);
    }

    findOne(filter: Filter): Promise<User> {
        return Promise.resolve(undefined);
    }

    updateOne(filter: Filter): Promise<User> {
        return Promise.resolve(undefined);
    }
}
