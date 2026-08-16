import type { Redis } from 'ioredis';

export async function connectRedis(redis: Redis): Promise<void> {
  if (redis.status === 'ready') {
    return;
  }

  await redis.connect();
}

export async function disconnectRedis(redis: Redis): Promise<void> {
  if (redis.status === 'end') {
    return;
  }

  await redis.quit();
}