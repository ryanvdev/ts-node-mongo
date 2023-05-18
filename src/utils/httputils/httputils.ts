import { ZodError, z } from 'zod';
import { ZodObjectFn } from '../g';
import _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import zodissues from '../zodissues';
import locallog from '../locallog';

export interface CreateRequestMiddlewareValidator {
    params?: ZodObjectFn[];
    query?: ZodObjectFn[];
    body?: ZodObjectFn[];
}

export function createRequestValidatorMiddleware(options: CreateRequestMiddlewareValidator) {
    const {
        body: bodyTypes,
        params: paramsTypes,
        query: queryTypes,
    } = _.defaults(options, {
        body: [],
        params: [],
        query: [],
    } as CreateRequestMiddlewareValidator) as Required<CreateRequestMiddlewareValidator>;

    const paramsSchemas = paramsTypes.map((item) => item());
    const querySchemas = queryTypes.map((item) => item());
    const bodySchemas = bodyTypes.map((item) => item());

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let params = req.params;
            let query = req.query;
            let body = req.body;

            for (const schema of paramsSchemas) {
                params = await schema.parseAsync(params);
            }
            for (const schema of querySchemas) {
                query = await schema.parseAsync(query);
            }
            for (const schema of bodySchemas) {
                body = await schema.parseAsync(body);
            }

            req.params = params;
            req.query = query;
            req.body = body;

            next();
            return;
        } catch (e) {
            if (e instanceof ZodError) {
                if (!__env.DEBUG) {
                    res.sendStatus(400).end();
                    return;
                }

                //* @debug
                const error = zodissues.toIssuesTypeOne(e.issues);
                locallog.object(error, req.path);
                res.status(400).json(error);
                return;
            }

            locallog.log(e);
            res.sendStatus(500);
            return;
        }
    };
}
