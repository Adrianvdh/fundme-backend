import { ObjectId } from 'mongodb';
import { Wallet } from '@/shared/blockchain/model/blockchain.model';

export interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    wallet: Wallet;
}
