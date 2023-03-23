import { NextFunction, Request, Response } from 'express';
import { logger } from '@/shared/utils/logger';
import { BaseException } from '@/shared/exceptions/exceptions';

const baseErrorMiddleware = (error: BaseException, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof BaseException) {
            logger.error(`[${req.method}] ${req.path} >> ${error.message}`);
            res.status(error.statusCode).json({ message: error.message });
        } else {
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

export default baseErrorMiddleware;
