import { Response } from 'express';

export class HttpResponse {
    public static ok(res: Response, data?: unknown) {
        res.status(200).json(data);
    }

    public static created(res: Response, data?: unknown) {
        res.status(201).json(data);
    }

    public static notFound(res: Response, data?: unknown) {
        res.status(404).json(data);
    }

    public static noContent(res: Response, data?: unknown) {
        res.status(204).json(data);
    }

    public static badRequest(res: Response, message?: unknown) {
        res.status(400).json({ error: message });
    }

    public static unauthorized(res: Response, data?: unknown) {
        res.status(401).json(data);
    }

    public static forbidden(res: Response, data?: unknown) {
        res.status(403).json(data);
    }

    public static internalServerError(res: Response, data?: unknown) {
        res.status(500).json(data);
    }
}
