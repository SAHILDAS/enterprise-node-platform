export type UserRole = 'ADMIN' | 'USER';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface HealthResponse {
  status: 'ok';
  service: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  correlationId?: string;
}