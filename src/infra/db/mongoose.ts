import mongoose from 'mongoose';
import { env } from '../../config/env.js';
import { logger } from '../../shared/logger/index.js';

export async function connectMongo() {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => logger.info({ db: 'mongo' }, '[mongo] connected'));
  mongoose.connection.on('reconnected', () => logger.warn({ db: 'mongo' }, '[mongo] reconnected'));
  mongoose.connection.on('disconnected', () => logger.warn({ db: 'mongo' }, '[mongo] disconnected'));
  mongoose.connection.on('error', (e) => logger.error({ db: 'mongo', err: e }, '[mongo] error'));

  await mongoose.connect(env.MONGO_URI);
}

export function mongoState(): 'disconnected' | 'connected' | 'connecting' | 'disconnecting' {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const map: Record<number, any> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return map[mongoose.connection.readyState] ?? 'disconnected';
}
