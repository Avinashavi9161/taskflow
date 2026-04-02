import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post(
  '/register',
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters.'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.').matches(/\d/).withMessage('Password must contain at least one number.'),
  validate,
  authController.register,
);

router.post(
  '/login',
  body('email').trim().isEmail().withMessage('Please enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
  validate,
  authController.login,
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.me);

export default router;
