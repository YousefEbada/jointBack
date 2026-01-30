import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {

  let status = err.status ?? 500;
  let code = err.code ?? 'INTERNAL_ERROR';
  let message = err.message ?? 'Something went wrong';
  let details: any;


  if (err instanceof ZodError) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request';
    details = err.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
  }

  if (err?.name === 'MongoServerError' && err?.code === 11000) {
    status = 409;
    code = 'DUPLICATE_KEY';
    message = 'Duplicate value';
    details = { keyValue: err.keyValue };
  }

  if (err?.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err?.path ?? 'identifier'}`;
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    code,
    message,
    ...(details ? { details } : {}),
    ...(req.traceId ? { traceId: req.traceId } : {})
  });
}



// export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
//   const status = err.status || 500;
//   const code = err.code || 'INTERNAL_ERROR';
//   const message = err.message || 'Something went wrong';
//   if (status >= 500) console.error(err);
//   res.status(status).json({ code, message });
// }
// path: src/shared/middleware/errorHandler.ts