import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { UserRepository } from '@/modules/users/repository/UserRepository';
import { DataStoredInToken, RequestWithUser } from '@/modules/auth/api/auth.models';
import { Unauthenticated } from '@/shared/exceptions/exceptions';

const authMiddleware = (userRepository: UserRepository) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const Authorization =
                req.cookies['Authorization'] ||
                (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

            if (Authorization) {
                const secretKey: string = SECRET_KEY;
                const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
                const userId = verificationResponse._id;
                const findUser = await userRepository.findOneById(userId);

                if (findUser) {
                    req.user = findUser;
                    req.userId = findUser._id.toString();
                    next();
                } else {
                    next(new Unauthenticated());
                }
            } else {
                next(new Unauthenticated());
            }
        } catch (error) {
            next(new Unauthenticated());
        }
    };
};

export default authMiddleware;
