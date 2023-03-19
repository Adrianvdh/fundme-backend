export class BaseException extends Error {
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}

export class IllegalArgument extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class NotFound extends BaseException {
    constructor(message: string) {
        super(message);
    }
}

export class AlreadyExists extends BaseException {
    public objectId: string;
    constructor(objectId: string, message: string) {
        super(message);
        this.objectId = objectId;
    }
}
