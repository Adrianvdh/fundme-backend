import { User, UserDetails, UserPicture } from '@/modules/users/models/users.interface';

export interface IUserRepository {
    findOneById(userId: string): Promise<User>;

    findOneById(userId: string): Promise<User>;

    findOneByEmail(email: string): Promise<User>;

    findAll(): Promise<User[]>;

    create(user: UserDetails): Promise<User>;

    updateOne(userId: string, user: User): Promise<User>;

    updateUserPicture(userId: string, user: UserPicture): Promise<User>;

    deleteOne(userId: string);
}
