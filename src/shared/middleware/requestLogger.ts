import {pinoHttp} from 'pino-http';
import { logger } from '../logger/index.js';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'http';

export const requestLogger = pinoHttp({
    logger,
    autoLogging: {
        ignore: (req: IncomingMessage) =>
            typeof req.url === 'string' && req.url.startsWith('/health')
    },
    genReqId: (req: any, res: any) => {
        const id = req.traceId || req.id || randomUUID();
        res.setHeader('x-request-id', id);
        return id;
    },
    serializers: {
        req(request: any) {
            return {
                id: (request as any).id,
                method: request.method,
                url: request.url
            };
        },
        res(response: any) {
            return {
                statusCode: response.statusCode
            };
        }
    },
    customLogLevel: (req: IncomingMessage, res: ServerResponse, err?: Error) => {
        if (err || (res.statusCode && res.statusCode >= 500)) return 'error';
        if (res.statusCode && res.statusCode >= 400) return 'warn';
        return 'info';
    }
});
