import crypto from 'node:crypto';
import { AuthRepository } from './auth.repository.js';
import { SessionService } from './session.service.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt.js';
import { hashRefreshToken } from '../../utils/token-hash.js';


export class AuthService {
  constructor(
    private readonly repository = new AuthRepository(),
    private readonly sessionService = new SessionService(),
  ) {}

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

  async login(
    email: string,
    password: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    },
  ) {
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

    const refreshTokenId = crypto.randomUUID();
    const tokenFamily = crypto.randomUUID();

    const refreshToken = generateRefreshToken(payload, refreshTokenId);

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionService.createSession({
      userId: user.id,
      refreshTokenHash,
      refreshTokenId,
      tokenFamily,
      expiresAt,
      ...(metadata?.ipAddress !== undefined && {
        ipAddress: metadata.ipAddress,
      }),
      ...(metadata?.userAgent !== undefined && {
        userAgent: metadata.userAgent,
      }),
    });

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