// src/app.ts
import express from 'express';
import employeeRoutes from './modules/employees/employee.routes.js';
import requestRoutes from './modules/requests/request.routes.js';
import authRoutes from './modules/login/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { authMiddleware } from './middlewares/auth.middleware.js';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/employees', authMiddleware, employeeRoutes);
app.use('/requests', authMiddleware, requestRoutes);

app.use(errorMiddleware);