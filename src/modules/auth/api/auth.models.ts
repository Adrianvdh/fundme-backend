import { Request } from 'express';
import { User } from '@/modules/users/models/users.interface';

import { IsEmail, IsString } from 'class-validator';
import { UserResponse } from '@/modules/users/api/users.model';

export class LoginRequest {
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    user: UserResponse;
}

export interface DataStoredInToken {
    _id: string;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithUser extends Request {
    user: User;
    userId: string;
}
