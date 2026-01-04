import express from 'express';
import {body} from 'express-validator'
import * as authController from './auth.controllers'
import {basicAuth} from '../../middleware/auth.middleware'

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
  ],
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  authController.login
);

// Protected: use Basic Auth header
router.get('/profile', basicAuth, authController.profile);


router.put(
  '/profile',
  basicAuth,
  [
    body('name').optional().isString(),
    body('password').optional().isLength({ min: 6 }),
    body('phone').optional().isString(),
    body('address').optional().isString(),
  ],
  authController.updateProfile
);

// Delete account (protected)
router.delete('/profile', basicAuth, authController.deleteAccount);

// Update push token (protected)
router.put(
  '/push-token',
  basicAuth,
  [body('pushToken').notEmpty().isString()],
  authController.updatePushToken
);

export default router;