import { User } from '@/modules/users/models/users.interface';
import { MongoDict } from '@/config/databases/types';

export interface IUserRepository {
    find(filter: MongoDict): Promise<User>;

    findOneById(userId: string): Promise<User>;

    findOneByEmail(email: string): Promise<User>;

    findAll(): Promise<User[]>;

    create(user: User): Promise<User>;

    updateOne(userId: string, user: User): Promise<User>;

    deleteOne(userId: string);
}
