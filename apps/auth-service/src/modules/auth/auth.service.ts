import crypto from 'node:crypto';

import { AuthRepository } from './auth.repository.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt.js';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(email: string, password: string) {
    const existing = await this.repository.findUserByEmail(email);

    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(password);

    const user = await this.repository.createUser(email, passwordHash);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await this.repository.findUserByEmail(email);

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const valid = await verifyPassword(user.passwordHash, password);

    if (!valid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.repository.saveRefreshToken(
      user.id,
      refreshTokenHash,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}