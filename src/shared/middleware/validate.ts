import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

type Schemas = {
    body?: AnyZodObject;
    query?: AnyZodObject;
    params?: AnyZodObject;
};


export function validate(schemas: Schemas) {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schemas.body) req.body = schemas.body.parse(req.body);
            if (schemas.query) req.query = schemas.query.parse(req.query);
            if (schemas.params) req.params = schemas.params.parse(req.params);
            next();
        } catch (e) {
            if (e instanceof ZodError) return next(e);
            return next(e);
        }
    };
}
