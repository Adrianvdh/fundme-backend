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
}

export type DisplayableUser = Pick<User, '_id' | 'displayName' | 'email' | 'picture'>;
