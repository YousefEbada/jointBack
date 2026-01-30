
import pino from 'pino';

export const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // Redact Authorization/OTP/fileBase64/Passwords
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.code',
            'req.body.fileBase64',
            'password',
            'code',
            'fileBase64'
        ],
        censor: '[REDACTED]'
    },
});
