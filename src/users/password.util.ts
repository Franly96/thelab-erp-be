import { createHash, randomUUID } from 'crypto';

const DEFAULT_SALT = process.env.PASSWORD_SALT ?? 'thelab-salt';

export function hashPassword(password: string, salt: string = DEFAULT_SALT) {
  return createHash('sha256').update(`${password}:${salt}`).digest('hex');
}

export function verifyPassword(password: string, hash: string) {
  return hashPassword(password) === hash;
}

export function generateSessionToken() {
  return randomUUID();
}
