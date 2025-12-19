import { Router } from 'express';
import { RequestController } from './request.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createRequestSchema } from './request.validators.js';
import { requireRole } from '../../middlewares/role.middleware.js';

const router = Router();
const controller = new RequestController();

router.post('/', validate(createRequestSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.get('/:id/history', requireRole('APPROVER'), controller.getHistory);
router.patch('/:id/approve', requireRole('APPROVER'), controller.approve);
router.patch('/:id/reject', requireRole('APPROVER'), controller.reject);
router.patch('/:id/cancel', requireRole('EMPLOYEE'), controller.cancel);

export default router;
