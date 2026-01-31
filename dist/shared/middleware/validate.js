import { ZodError } from 'zod';
export function validate(schemas) {
    return (req, _res, next) => {
        try {
            if (schemas.body)
                req.body = schemas.body.parse(req.body);
            if (schemas.query)
                req.query = schemas.query.parse(req.query);
            if (schemas.params)
                req.params = schemas.params.parse(req.params);
            next();
        }
        catch (e) {
            if (e instanceof ZodError)
                return next(e);
            return next(e);
        }
    };
}
