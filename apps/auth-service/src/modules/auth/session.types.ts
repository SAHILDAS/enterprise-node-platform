export interface Session {
  id: string;
  userId: string;

  refreshTokenHash: string;
  refreshTokenId: string;
  tokenFamily: string;

  revoked: boolean;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;

  lastUsedAt: Date | null;

  ipAddress: string | null;
  userAgent: string | null;
}

export interface CreateSessionInput {
  userId: string;

  refreshTokenHash: string;
  refreshTokenId: string;
  tokenFamily: string;

  expiresAt: Date;

  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateSessionInput {
  lastUsedAt?: Date;
  revoked?: boolean;
}