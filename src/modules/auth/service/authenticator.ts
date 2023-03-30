import { User } from '@/modules/users/models/users.interface';
import { DataStoredInToken, TokenData } from '@/modules/auth/api/auth.models';
import { SECRET_KEY } from '@config';
import { sign } from 'jsonwebtoken';

export class Authenticator {
    public createToken(user: User): TokenData {
        const dataStoredInToken: DataStoredInToken = { _id: user._id.toString() };
        const secretKey: string = SECRET_KEY;
        const expiresIn: number = 60 * 60 * 24 * 3; // 3 Days (in seconds)

        return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
    }

    public createCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
}
