import { IsEmail, IsString } from 'class-validator';
import { FileField } from '@/shared/storage/file.interface';
import { DisplayableUser } from '@/modules/users/models/users.interface';

export class CreateUserRequest {
    @IsEmail()
    public email: string;

    @IsString()
    public displayName: string;

    @IsString()
    public password: string;
}

export interface UserResponse {
    _id: string;
    email: string;
    displayName: string;
    picture: FileField;
}

export function mapDisplayableUserToUserResponse(user: DisplayableUser): UserResponse {
    if (!user) {
        return undefined;
    }
    return {
        ...user,
        _id: user._id.toString(),
    };
}
