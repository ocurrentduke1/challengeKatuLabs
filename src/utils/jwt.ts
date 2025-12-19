import jwt, { type Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
  sub: string;
  role: 'EMPLOYEE' | 'APPROVER';
}

const JWT_SECRET: Secret = env.jwt.secret;

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.jwt.expiresIn || '1d',
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
