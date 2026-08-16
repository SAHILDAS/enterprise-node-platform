import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import type { Redis } from '@platform/redis';

import {
  connectRedis,
  createRedisClient,
  disconnectRedis,
} from '@platform/redis';

export interface RedisPluginOptions {
  redisUrl: string;
}

const redisPlugin: FastifyPluginAsync<RedisPluginOptions> = async (
  app,
  options,
) => {
  const redis = createRedisClient(options.redisUrl);

  await connectRedis(redis);

  app.decorate('redis', redis);

  app.addHook('onClose', async () => {
    await disconnectRedis(redis);
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

export default fp(redisPlugin, {
  name: 'redis',
});