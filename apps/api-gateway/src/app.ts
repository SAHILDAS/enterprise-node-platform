import crypto from 'node:crypto';

import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

import { createLoggerOptions } from '@platform/logger';
import { loadConfig } from '@platform/config';

import { authProxyRoutes } from './routes/auth-proxy.js';
import { protectedRoutes } from './routes/protected.js';

export async function buildApp() {
  const config = loadConfig();

  const app = Fastify({
    logger: createLoggerOptions('api-gateway'),
    requestIdHeader: 'x-correlation-id',
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(helmet);

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(sensible);
  await app.register(protectedRoutes);

  app.get('/health', async () => ({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  }));

  app.get('/ready', async () => ({
    status: 'ready',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  }));

  await app.register(authProxyRoutes);

  app.get('/', async () => ({
    service: 'api-gateway',
    version: '0.1.0',
    environment: config.NODE_ENV,
  }));

  return app;
}