import { PrismaSessionRepository } from './session.prisma-repository.js';
import type { SessionRepository } from './session.repository.js';
import type {
  CreateSessionInput,
  Session,
  UpdateSessionInput,
} from './session.types.js';

export class SessionService {
  constructor(
    private readonly repository: SessionRepository =
      new PrismaSessionRepository(),
  ) {}

  async createSession(input: CreateSessionInput): Promise<Session> {
    return this.repository.create(input);
  }

  async getSession(id: string): Promise<Session | null> {
    return this.repository.findById(id);
  }

  async getSessionByRefreshTokenId(
    refreshTokenId: string,
  ): Promise<Session | null> {
    return this.repository.findByRefreshTokenId(refreshTokenId);
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return this.repository.findByUserId(userId);
  }

  async updateSession(
    id: string,
    input: UpdateSessionInput,
  ): Promise<Session> {
    return this.repository.update(id, input);
  }

  async revokeSession(id: string): Promise<Session> {
    return this.repository.revoke(id);
  }
}