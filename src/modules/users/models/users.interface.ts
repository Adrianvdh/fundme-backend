import { ObjectId } from 'mongodb';
import { Wallet } from '@/shared/blockchain/model/blockchain.model';
import { FileField } from '@/shared/storage/file.interface';

export interface User {
    _id?: ObjectId;
    displayName: string;
    email: string;
    password: string;
    picture: FileField;
    wallet: Wallet;
    created: Date;
    modified: Date;
}

export type UserDetails = Pick<User, 'email' | 'displayName' | 'password' | 'wallet'>;

export type UserPicture = Pick<User, 'picture'>;

export type DisplayableUser = Pick<User, '_id' | 'displayName' | 'email' | 'picture' | 'created' | 'modified'>;
