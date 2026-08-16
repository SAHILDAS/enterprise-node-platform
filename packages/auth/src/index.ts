import jwt from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function verifyAccessToken(
  token: string,
  secret: string,
): JwtPayload {
  const payload = jwt.verify(token, secret);

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'userId' in payload &&
    'email' in payload &&
    'role' in payload
  ) {
    return payload as JwtPayload;
  }

  throw new Error('INVALID_TOKEN_PAYLOAD');
}