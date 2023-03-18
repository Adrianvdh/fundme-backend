import { IsEmail, IsString } from 'class-validator';

export class CreateUserRequest {
    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}
