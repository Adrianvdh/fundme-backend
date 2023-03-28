import { plainToClass } from 'class-transformer';
import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Constructable } from '@/shared/types';
import { ValidationError } from '@/shared/exceptions/exceptions';

const validated = (
    type: Constructable<any>,
    value: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
    whitelist = true,
    forbidNonWhitelisted = true,
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const reqBodyObj = plainToClass(type, req[value]);
        const validationErrors = await validate(reqBodyObj, {
            skipMissingProperties,
            whitelist,
            forbidNonWhitelisted,
            validationError: { target: false, value: true },
        });
        if (validationErrors.length > 0) {
            const message = validationErrors.map((error: ClassValidationError) => {
                return Object.values(error.constraints).map(value => ({ [error.property]: value }))[0];
            });
            next(new ValidationError(message));
        } else {
            next();
        }
    };
};

export default validated;
