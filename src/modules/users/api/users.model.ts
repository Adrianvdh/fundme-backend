import { IsEmail, IsString } from 'class-validator';

export class CreateUserRequest {
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}

export interface UserResponse {
    _id: string;
    email: string;
}
