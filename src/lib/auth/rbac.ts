import { getAuthCookie } from './cookies';
import { verifyAccessToken, JwtPayload } from './jwt';

export function getSessionUser(): JwtPayload | null {
  const token = getAuthCookie();
  if (!token) return null;
  return verifyAccessToken(token);
}

export function requireAuth(): JwtPayload {
  const user = getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function requireAdmin(): JwtPayload {
  const user = requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}
