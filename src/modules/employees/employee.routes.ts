import { Router } from 'express';
import { EmployeeController } from './employee.controller.js';

const router = Router();
const controller = new EmployeeController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);

export default router;
