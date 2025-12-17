import { Router } from 'express';
import { EmployeeController } from './employee.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createEmployeeSchema } from './employee.validators.js';

const router = Router();
const controller = new EmployeeController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/',validate(createEmployeeSchema), controller.create);

export default router;
