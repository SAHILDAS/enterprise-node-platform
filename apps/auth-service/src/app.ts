import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

import { loadAuthConfig } from '@platform/config';
import { createLoggerOptions } from '@platform/logger';

import redisPlugin from './plugins/redis.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';

export async function buildApp() {
  const config = loadAuthConfig();

  const app = Fastify({
    logger: createLoggerOptions('auth-service'),
    requestIdHeader: 'x-correlation-id',
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(redisPlugin, {
    redisUrl: config.REDIS_URL,
  });

  await app.register(helmet);

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(sensible);

  await app.register(healthRoutes);

  await app.register(authRoutes);

  app.get('/', async () => ({
    service: 'auth-service',
    version: '0.1.0',
    environment: config.NODE_ENV,
  }));

  return app;
}