import { User } from '@/modules/users/models/users.interface';
import { Filter } from '@/config/databases/types';
import { CreateUserRequest } from '@/modules/users/api/users.model';

export interface IUserRepository {
    findAll(): Promise<User[]>;

    findOne(filter: Filter): Promise<User>;

    create(create: CreateUserRequest): Promise<User>;

    updateOne(filter: Filter, data: any): Promise<User>;

    deleteOne(objectId: string): Promise<User>;
}
