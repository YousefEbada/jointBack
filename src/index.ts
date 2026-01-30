import { startServer } from './app/server.js';
import { logger } from './shared/logger/index.js';

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'unhandledRejection');
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaughtException');
  // process.exit(1);
});

startServer().catch((e) => {
  logger.fatal({ err: e }, 'fatal startup error');
  process.exit(1);
});
