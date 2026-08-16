import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

const localEnv = resolve(process.cwd(), '.env');

if (existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else {
  dotenv.config();
}

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  POSTGRES_URL: z.string().url().optional(),
  MONGODB_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  KAFKA_BROKER: z.string().optional(),

  JWT_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),

  API_GATEWAY_PORT: z.coerce.number().default(3000),
  AUTH_SERVICE_PORT: z.coerce.number().default(4001),
  AUTH_SERVICE_URL: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

let cachedConfig: AppConfig | null = null;

export function loadConfig(): AppConfig {
  if (cachedConfig) return cachedConfig;

  const parsed = ConfigSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Configuration validation failed');
    console.error(parsed.error.format());
    process.exit(1);
  }

  cachedConfig = parsed.data;
  return cachedConfig;
}