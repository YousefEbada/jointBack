import { randomUUID } from 'node:crypto';
export function traceId(req, res, next) {
    const incoming = req.headers['x-request-id'] || undefined;
    const id = incoming || randomUUID();
    req.traceId = id;
    res.setHeader('x-request-id', id);
    next();
}
