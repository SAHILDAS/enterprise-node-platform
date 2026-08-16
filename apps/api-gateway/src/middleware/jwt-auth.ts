import type { FastifyReply, FastifyRequest } from 'fastify';

import { verifyAccessToken } from '@platform/auth';
import { loadGatewayConfig } from '@platform/config';

const config = loadGatewayConfig();

const jwtSecret = config.JWT_SECRET;

export async function jwtAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    reply.code(401).send({
      code: 'UNAUTHORIZED',
      message: 'Authorization header is required',
    });
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    reply.code(401).send({
      code: 'INVALID_AUTH_HEADER',
      message: 'Bearer token is required',
    });
    return;
  }

  try {
    const user = verifyAccessToken(token, jwtSecret);

    request.user = user;
  } catch {
    reply.code(401).send({
      code: 'INVALID_TOKEN',
      message: 'Token is invalid or expired',
    });
  }
}