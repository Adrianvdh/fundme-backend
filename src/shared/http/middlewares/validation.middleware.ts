import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpException } from '@/shared/http/exceptions/HttpException';
import { Constructable } from '@/shared/types';

const validationMiddleware = (
    type: Constructable<any>,
    value: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const reqBodyObj = plainToClass(type, req[value]);
        const validationErrors = await validate(reqBodyObj, { skipMissingProperties, whitelist, forbidNonWhitelisted });
        if (validationErrors.length > 0) {
            const message = validationErrors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
            next(new HttpException(400, message));
        } else {
            next();
        }
    };
};

export default validationMiddleware;
