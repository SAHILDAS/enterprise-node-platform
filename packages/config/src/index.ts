import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  POSTGRES_URL: z.string().url(),

  MONGODB_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  KAFKA_BROKER: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  API_GATEWAY_PORT: z.coerce.number().default(3000),

  AUTH_SERVICE_PORT: z.coerce.number().default(4001),
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