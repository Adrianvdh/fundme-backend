export class BaseException extends Error {
    public statusCode = 400;
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

export type Error = {
    [key: string]: string | { [key: string]: string };
};

export class ValidationError extends BaseException {
    public statusCode = 400;
    public message = 'There were some errors processing your request!';
    public errors: string | Error | Array<Error>;

    constructor(error: string | Error | Array<Error>) {
        super('ValidationError');
        this.errors = error;
    }

    public toJson() {
        return {
            message: this.message,
            errors: this.errors,
        };
    }
}

export class Unauthenticated extends BaseException {
    public statusCode = 401;
    constructor(message?: string) {
        message = message || "You aren't authenticated please log in!";
        super(message);
    }
}

export class NotFound extends BaseException {
    public statusCode = 404;
    constructor(message: string) {
        super(message);
    }
}

export class ServiceException extends BaseException {
    public statusCode = 500;
    constructor(message: string, error: string) {
        super(message + '\n ' + error);
    }
}

export class MongoException extends BaseException {
    public statusCode = 500;
    constructor(message: string) {
        super(message);
    }
}
