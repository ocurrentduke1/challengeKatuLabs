import { Router } from 'express';
import { RequestController } from './request.controller.js';

const router = Router();
const controller = new RequestController();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getById);
router.patch('/:id/approve', controller.approve);
router.patch('/:id/reject', controller.reject);
router.patch('/:id/cancel', controller.cancel);

export default router;
