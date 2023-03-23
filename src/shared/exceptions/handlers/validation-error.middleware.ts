import { NextFunction, Request, Response } from 'express';
import { logger } from '@/shared/utils/logger';
import { ValidationError } from '@/shared/exceptions/exceptions';

const validationErrorMiddleware = (error: ValidationError, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof ValidationError) {
            logger.error(`[${req.method}] ${req.path} >> ${JSON.stringify(error.errors)}`);
            res.status(error.statusCode).json(error.toJson());
        } else {
            next(error);
        }
    } catch (error) {
        next(error);
    }
};

export default validationErrorMiddleware;
