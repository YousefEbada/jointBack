import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

declare module 'express-serve-static-core' {
  interface Request {
    traceId?: string;
  }
}

export function traceId(req: Request, res: Response, next: NextFunction) {
  const incoming = (req.headers['x-request-id'] as string) || undefined;
  const id = incoming || randomUUID();
  req.traceId = id;
  res.setHeader('x-request-id', id);
  next();
}
