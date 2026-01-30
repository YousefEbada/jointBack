import express from 'express';
import { createServer } from 'http';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import {pinoHttp} from 'pino-http';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { mountRoutes } from './routes.js';
import { connectMongo, mongoState } from '../infra/db/mongoose.js';
import { errorHandler } from '../shared/middleware/errorHandler.js';
import { traceId } from '../shared/middleware/traceId.js';
import { bindAll } from './container.bindings.js';
import { requestLogger } from '../shared/middleware/requestLogger.js';
import { StartJobs } from '../jobs/startJobs.js';
import { ChatSocketService } from '../modules/chat/infrastructure/ChatSocketService.js';

export async function startServer() {
  try {
    bindAll();

    const app = express();
    const httpServer = createServer(app);

    // Initialize Socket.IO for chat
    const chatSocketService = new ChatSocketService(httpServer);

    // --- Middleware ---
    app.use(helmet());
    const allowedOrigins = (env.CORS_ORIGINS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    app.use(cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: false
    }));

    app.use(compression());
    app.use(express.json({ limit: '10mb' }));
    app.use(traceId);
    if (requestLogger) app.use(requestLogger as any);
    app.use(pinoHttp());
    app.use(rateLimit({
      windowMs: Number(env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(env.RATE_LIMIT_MAX) || 100,
      standardHeaders: true,
      legacyHeaders: false
    }));

    // --- Health check ---
    app.get('/health', (req, res) => {
      try {
        res.json({
          ok: true,
          service: 'api',
          env: env.NODE_ENV,
          now: new Date().toISOString(),
          uptimeSec: Math.round(process.uptime()),
          mongo: mongoState(),
          traceId: (req as any).traceId
        });
      } catch (err) {
        console.error('Health check failed', err);
        res.status(500).json({ ok: false, error: 'Health check failed' });
      }
    });

    app.get('/', (req, res) => res.send('Server is running'));

    // --- Routes & error handler ---
    mountRoutes(app);
    app.use(errorHandler);

    // --- Start server ---
    const PORT = Number(process.env.PORT) || Number(env.PORT) || 4000;
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`API running on port ${PORT}`);
      console.log(`Socket.IO chat service initialized`);
    });

    // --- Non-blocking MongoDB & Jobs ---
    connectMongo()
      .then(() => {
        console.log('Mongo connected');
        try { StartJobs(); } catch (err) {
          console.error('StartJobs failed:', err);
        }
      })
      .catch(err => console.error('Mongo connection failed:', err));

    // --- Global crash protection ---
    process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
    process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1); // fail gracefully
  }
}
