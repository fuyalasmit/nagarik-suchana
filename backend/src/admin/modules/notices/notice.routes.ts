import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import * as noticeController from './notice.controllers';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to conditionally apply multer based on content-type
const conditionalUpload = (req: any, res: any, next: any) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return upload.single('file')(req, res, next);
  }
  next();
};

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

// Update notice (with optional file upload) - supports both JSON and multipart
router.put('/:id', conditionalUpload, noticeController.updateNotice);

// Delete notice
router.delete('/:id', noticeController.deleteNotice);

export default router;
