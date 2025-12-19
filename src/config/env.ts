import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL as string,

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn']
  }
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

if (!env.jwt.secret) {
  throw new Error('JWT_SECRET is not defined');
}
