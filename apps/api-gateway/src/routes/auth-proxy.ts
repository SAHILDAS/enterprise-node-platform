import type { FastifyInstance } from 'fastify';
import proxy from '@fastify/http-proxy';

import { loadGatewayConfig } from '@platform/config';



export async function authProxyRoutes(app: FastifyInstance) {
  const config = loadGatewayConfig();

  if (!config.AUTH_SERVICE_URL) {
    throw new Error('AUTH_SERVICE_URL is not configured');
  }

  await app.register(proxy, {
    upstream: config.AUTH_SERVICE_URL,
    prefix: '/auth',
    rewritePrefix: '/auth',
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => ({
        ...headers,
        'x-correlation-id':
          request.headers['x-correlation-id'] ?? request.id,
      }),
    },
  });
}