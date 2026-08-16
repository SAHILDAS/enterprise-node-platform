import type { FastifyInstance } from 'fastify';

import { prisma } from '../plugins/prisma.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
  }));

  app.get('/ready', async (_, reply) => {
    const [databaseResult, redisResult] = await Promise.allSettled([
      prisma.$queryRaw`SELECT 1`,
      app.redis.ping(),
    ]);

    const databaseConnected = databaseResult.status === 'fulfilled';
    const redisConnected =
      redisResult.status === 'fulfilled' && redisResult.value === 'PONG';

    const ready = databaseConnected && redisConnected;

    if (!ready) {
      reply.code(503);
    }

    return {
      status: ready ? 'ready' : 'not_ready',
      database: databaseConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  });
}