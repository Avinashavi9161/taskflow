import { Router } from 'express';
import { body } from 'express-validator';
import { taskController } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticate);

// Stats
router.get('/stats', taskController.getStats);

// Collection
router.get('/', taskController.getAll);
router.post(
  '/',
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 200 }).withMessage('Title must be under 200 characters.'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be under 2000 characters.'),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status.'),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority.'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid ISO date.'),
  validate,
  taskController.create,
);

// Individual
router.get('/:id', taskController.getById);

router.patch(
  '/:id',
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.').isLength({ max: 200 }),
  body('description').optional().isLength({ max: 2000 }),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format.'),
  validate,
  taskController.update,
);

router.delete('/:id', taskController.delete);
router.patch('/:id/toggle', taskController.toggle);

export default router;
