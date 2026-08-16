import { prisma } from '../../plugins/prisma.js';

import type {
  CreateSessionInput,
  Session,
  UpdateSessionInput,
} from './session.types.js';

export class PrismaSessionRepository {
  async create(input: CreateSessionInput): Promise<Session> {
    return prisma.session.create({
      data: {
        userId: input.userId,
        refreshTokenHash: input.refreshTokenHash,
        refreshTokenId: input.refreshTokenId,
        tokenFamily: input.tokenFamily,
        expiresAt: input.expiresAt,
        ...(input.ipAddress !== undefined && {
          ipAddress: input.ipAddress,
        }),
        ...(input.userAgent !== undefined && {
          userAgent: input.userAgent,
        }),
      },
    });
  }

  async findById(id: string): Promise<Session | null> {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  async findByRefreshTokenId(
    refreshTokenId: string,
  ): Promise<Session | null> {
    return prisma.session.findUnique({
      where: {
        refreshTokenId,
      },
    });
  }

  async findByUserId(userId: string): Promise<Session[]> {
    return prisma.session.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    input: UpdateSessionInput,
  ): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        ...(input.lastUsedAt !== undefined && {
          lastUsedAt: input.lastUsedAt,
        }),
        ...(input.revoked !== undefined && {
          revoked: input.revoked,
        }),
      },
    });
  }

  async revoke(id: string): Promise<Session> {
    return prisma.session.update({
      where: { id },
      data: {
        revoked: true,
      },
    });
  }
}