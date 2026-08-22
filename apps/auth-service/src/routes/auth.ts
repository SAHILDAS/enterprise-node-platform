import type { FastifyInstance } from 'fastify';

import { AuthService } from '../modules/auth/auth.service.js';
import {
  LoginSchema,
  RegisterSchema,
} from '../modules/auth/auth.schemas.js';

const service = new AuthService();

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const body = RegisterSchema.parse(request.body);

    try {
      const user = await service.register(body.email, body.password);

      reply.code(201);

      return user;
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
        reply.code(409);

        return {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email is already registered',
        };
      }

      throw error;
    }
  });

app.post('/auth/login', async (request, reply) => {
  const body = LoginSchema.parse(request.body);

  try {
    return await service.login(body.email, body.password, {
      ipAddress: request.ip,
      ...(request.headers['user-agent'] !== undefined && {
        userAgent: request.headers['user-agent'],
      }),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      reply.code(401);

      return {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      };
    }

    throw error;
  }
});

}