// src/server.ts
import { app } from '../src/app.js';
import { env } from './config/env.js';
import './config/db.js';

app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
  console.log(`${env.databaseUrl}`);
});
