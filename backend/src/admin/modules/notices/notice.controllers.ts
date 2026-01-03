import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { put, del } from '@vercel/blob';
import path from 'path';
import * as noticeService from './notice.service';
import { CreateNoticeDto, UpdateNoticeDto } from './notice.types';
import { performOCRFromBuffer, extractFieldsWithLLM } from './notice.processor';

export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      return res.status(500).json({ error: 'Blob token not configured' });
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${req.file.originalname}`;

    const blob = await put(uniqueFilename, req.file.buffer, {
      access: 'public',
      token: blobToken,
    });

    return res.json({ url: blob.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createNotice(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const payload = req.body as CreateNoticeDto;
    
    // Handle tags - convert comma-separated string to array if needed
    if (payload.tags) {
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }
    
    // Handle file upload to Vercel Blob if file is present
    if (req.file) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (!blobToken) {
        return res.status(500).json({ error: 'Blob token not configured' });
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type. Only PDF and images (JPEG, PNG) are allowed.' 
        });
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        return res.status(400).json({ 
          error: 'File too large. Maximum size is 10MB.' 
        });
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const uniqueFilename = `notices/${timestamp}-${req.file.originalname}`;

      const blob = await put(uniqueFilename, req.file.buffer, {
        access: 'public',
        token: blobToken,
      });
      
      payload.url = blob.url;
      payload.processingStatus = 'processing';

      // Process OCR and LLM synchronously during upload
      try {
        const { ocrText, ocrConfidence } = await performOCRFromBuffer(req.file.buffer, req.file.mimetype);
        payload.ocrText = ocrText;
        payload.ocrConfidence = ocrConfidence;

        // Extract fields using LLM if OCR was successful
        if (ocrText) {
          const extractedFields = await extractFieldsWithLLM(ocrText);
          payload.extractedFields = extractedFields;
        }

        payload.processingStatus = 'completed';
      } catch (processingErr: any) {
        console.error('OCR/LLM processing failed:', processingErr);
        payload.processingStatus = 'failed';
        // Continue with notice creation even if processing fails
      }
    }
    
    const notice = await noticeService.createNotice(payload);
    
    return res.status(201).json({ notice });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getAllNotices(req: Request, res: Response) {
  try {
    const filters: any = {};

    if (req.query.status) filters.status = req.query.status;
    if (req.query.province) filters.province = req.query.province;
    if (req.query.district) filters.district = req.query.district;
    if (req.query.municipality) filters.municipality = req.query.municipality;
    if (req.query.ward) filters.ward = req.query.ward;
    if (req.query.tags) {
      filters.tags = Array.isArray(req.query.tags) 
        ? req.query.tags 
        : [req.query.tags];
    }

    const notices = await noticeService.getAllNotices(filters);
    return res.json({ notices });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getNoticeById(req: Request, res: Response) {
  try {
    const notice = await noticeService.getNoticeById(req.params.id);
    return res.json({ notice });
  } catch (err: any) {
    return res.status(404).json({ error: err.message });
  }
}

export async function updateNotice(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const payload = req.body as UpdateNoticeDto;
    
    // Handle tags - convert comma-separated string to array if needed
    if (payload.tags) {
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }
    
    // Handle file upload if present
    if (req.file) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (!blobToken) {
        return res.status(500).json({ error: 'Blob token not configured' });
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type. Only PDF and images (JPEG, PNG) are allowed.' 
        });
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        return res.status(400).json({ 
          error: 'File too large. Maximum size is 10MB.' 
        });
      }

      // Get existing notice to delete old file
      try {
        const existingNotice = await noticeService.getNoticeById(req.params.id);
        if (existingNotice.url) {
          try {
            await del(existingNotice.url, { token: blobToken });
          } catch (err) {
            console.error('Failed to delete old blob:', err);
          }
        }
      } catch (err) {
        // Notice might not exist, continue with upload
      }

      // Upload new file
      const timestamp = Date.now();
      const uniqueFilename = `notices/${timestamp}-${req.file.originalname}`;
      
      const blob = await put(uniqueFilename, req.file.buffer, {
        access: 'public',
        token: blobToken,
      });
      
      payload.url = blob.url;
    }
    
    const notice = await noticeService.updateNotice(req.params.id, payload);
    return res.json({ notice });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function deleteNotice(req: Request, res: Response) {
  try {
    // Get notice to retrieve blob URL before deletion
    const notice = await noticeService.getNoticeById(req.params.id);
    
    // Delete from database
    await noticeService.deleteNotice(req.params.id);
    
    // Delete from Vercel Blob if URL exists
    if (notice.url) {
      const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
      if (blobToken) {
        try {
          await del(notice.url, { token: blobToken });
        } catch (err) {
          console.error('Failed to delete blob:', err);
          // Continue anyway - database record is deleted
        }
      }
    }
    
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
