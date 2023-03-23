import { NextFunction, Request, Response } from 'express';
import { logger } from '@/shared/utils/logger';
import { BaseException } from '@/shared/exceptions/exceptions';

const internalServerErrorMiddleware = (error: BaseException, req: Request, res: Response, next: NextFunction) => {
    try {
        const status: number = error.statusCode || 500;
        const message = error.message || { message: 'Something went wrong' };

        logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
        res.status(status).json({ message });
    } catch (error) {
        next(error);
    }
};

export default internalServerErrorMiddleware;
