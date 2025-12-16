// src/config/db.ts
import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  connectionString: env.databaseUrl
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL');
});