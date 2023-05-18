import { NextFunction, Request, Response } from 'express';

export async function logRequestMiddleware(req: Request, res: Response, next: NextFunction) {
    const logObject = {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
    };

    res.status(200).json(logObject).end();
    return;
}
