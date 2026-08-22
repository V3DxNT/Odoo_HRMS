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

export function requireHR(): JwtPayload {
  const user = requireAuth();
  if (user.role !== 'HR') {
    throw new Error('Forbidden: HR access required');
  }
  return user;
}
