import { pinoHttp } from 'pino-http';
import { logger } from '../logger/index.js';
import { randomUUID } from 'node:crypto';
export const requestLogger = pinoHttp({
    logger,
    autoLogging: {
        ignore: (req) => typeof req.url === 'string' && req.url.startsWith('/health')
    },
    genReqId: (req, res) => {
        const id = req.traceId || req.id || randomUUID();
        res.setHeader('x-request-id', id);
        return id;
    },
    serializers: {
        req(request) {
            return {
                id: request.id,
                method: request.method,
                url: request.url
            };
        },
        res(response) {
            return {
                statusCode: response.statusCode
            };
        }
    },
    customLogLevel: (req, res, err) => {
        if (err || (res.statusCode && res.statusCode >= 500))
            return 'error';
        if (res.statusCode && res.statusCode >= 400)
            return 'warn';
        return 'info';
    }
});
