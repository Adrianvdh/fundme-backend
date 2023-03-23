import { NextFunction, Request, Response } from 'express';
import { logger } from '@/shared/utils/logger';
import { BaseException, Unauthenticated } from '@/shared/exceptions/exceptions';

const authenticationErrorMiddleware = (error: BaseException, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof Unauthenticated) {
            logger.error(`[${req.method}] ${req.path} >> ${error.message}`);
            res.status(401).json({ message: error.message });
        } else {
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

export default authenticationErrorMiddleware;
