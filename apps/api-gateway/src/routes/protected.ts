import type { FastifyInstance } from 'fastify';

import { jwtAuthMiddleware } from '../middleware/jwt-auth.js';

export async function protectedRoutes(app: FastifyInstance) {
  app.get(
    '/me',
    {
      preHandler: jwtAuthMiddleware,
    },
    async (request) => {
      return {
        authenticated: true,
        user: request.user,
      };
    },
  );
}