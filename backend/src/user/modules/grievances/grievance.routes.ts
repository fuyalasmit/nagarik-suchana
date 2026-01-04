import express from 'express';
import { body } from 'express-validator';
import * as grievanceController from './grievance.controllers';
import { basicAuth } from '../../middleware/auth.middleware';

const router = express.Router();

// Get user's grievances (protected)
router.get('/', basicAuth, grievanceController.getUserGrievances);

// Create new grievance (protected)
router.post(
  '/',
  basicAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn(['infrastructure', 'sanitation', 'utilities', 'transportation', 'healthcare', 'other']).withMessage('Invalid category'),
    body('priority').isIn(['high', 'medium', 'low']).withMessage('Invalid priority'),
    body('location').optional().isString(),
    body('wardNumber').optional().isNumeric(),
  ],
  grievanceController.createGrievance
);

// Get specific grievance (protected)
router.get('/:id', basicAuth, grievanceController.getGrievance);

// Update grievance status (protected - user can only update their own)
router.put('/:id', basicAuth, grievanceController.updateGrievance);

export default router;