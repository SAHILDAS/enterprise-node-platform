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

const AuthConfigSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  POSTGRES_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),

  JWT_REFRESH_SECRET: z.string().min(32),

  AUTH_SERVICE_PORT: z.coerce.number().default(4001),
});

export type AuthConfig = z.infer<typeof AuthConfigSchema>;

let cachedAuthConfig: AuthConfig | null = null;

export function loadAuthConfig(): AuthConfig {
  if (cachedAuthConfig) {
    return cachedAuthConfig;
  }

  const parsed = AuthConfigSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Auth configuration validation failed');
    console.error(parsed.error.format());
    process.exit(1);
  }

  cachedAuthConfig = parsed.data;

  return cachedAuthConfig;
}