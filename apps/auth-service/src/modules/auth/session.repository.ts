import type {
  CreateSessionInput,
  Session,
  UpdateSessionInput,
} from './session.types.js';

export interface SessionRepository {
  create(input: CreateSessionInput): Promise<Session>;

  findById(id: string): Promise<Session | null>;

  findByRefreshTokenId(refreshTokenId: string): Promise<Session | null>;

  findByUserId(userId: string): Promise<Session[]>;

  update(
    id: string,
    input: UpdateSessionInput,
  ): Promise<Session>;

  revoke(id: string): Promise<Session>;
}