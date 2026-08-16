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

const GatewayConfigSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  API_GATEWAY_PORT: z.coerce.number().default(3000),

  AUTH_SERVICE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
});

export type GatewayConfig = z.infer<typeof GatewayConfigSchema>;

let cached: GatewayConfig | null = null;

export function loadGatewayConfig(): GatewayConfig {
  if (cached) return cached;

  const parsed = GatewayConfigSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(parsed.error.format());
    process.exit(1);
  }

  cached = parsed.data;

  return cached;
}