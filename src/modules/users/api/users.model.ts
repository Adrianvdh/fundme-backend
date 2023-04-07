import { IsEmail, IsString } from 'class-validator';
import { FileField, mapFileField } from '@/shared/storage/file.interface';
import { DisplayableUser } from '@/modules/users/models/users.interface';
import { IStorageService } from '@/shared/storage/storage';

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
    displayName: string;
    email: string;
    picture: FileField;
    created: string;
    modified: string;
}

export async function mapDisplayableUserToUserResponse(
    user: DisplayableUser,
    storageService: IStorageService,
): Promise<UserResponse> {
    if (!user) {
        return undefined;
    }
    return {
        _id: user._id.toString(),
        displayName: user.displayName,
        email: user.email,
        picture: await mapFileField(user?.picture, storageService),
        created: user.created?.toISOString(),
        modified: user.modified?.toISOString(),
    };
}
