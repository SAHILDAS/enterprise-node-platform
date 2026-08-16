import jwt from 'jsonwebtoken';

import { loadConfig } from '@platform/config';
import type { JwtPayload } from '@platform/types';

const config = loadConfig();

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

const accessSecret = requireEnv(config.JWT_SECRET, 'JWT_SECRET');
const refreshSecret = requireEnv(
  config.JWT_REFRESH_SECRET,
  'JWT_REFRESH_SECRET',
);

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, accessSecret, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, refreshSecret, {
    expiresIn: '7d',
  });
}