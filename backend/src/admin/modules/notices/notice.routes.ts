import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import * as noticeController from './notice.controllers';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload file to Vercel Blob
router.post('/upload', upload.single('file'), noticeController.uploadFile);

// Create notice (with optional file upload)
router.post(
  '/',
  upload.single('file'),
  [body('title').notEmpty().withMessage('Title is required')],
  noticeController.createNotice
);

// Get all notices (with optional filters)
router.get('/', noticeController.getAllNotices);

// Get single notice by ID
router.get('/:id', noticeController.getNoticeById);

// Update notice (with optional file upload)
router.put('/:id', upload.single('file'), noticeController.updateNotice);

// Delete notice
router.delete('/:id', noticeController.deleteNotice);

export default router;
