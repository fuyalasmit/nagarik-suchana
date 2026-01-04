import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data for now (since we don't have Grievance model in Prisma schema)
const mockGrievances = [
  {
    id: 'g1',
    title: 'Street Light Not Working',
    description: 'The street light near my house has been broken for 2 weeks.',
    category: 'infrastructure',
    priority: 'medium',
    status: 'in-progress',
    submittedDate: '2026-01-01',
    wardNumber: 5,
    location: 'Main Road, Ward 5',
    userId: 'user123',
    response: 'Maintenance team has been notified.',
  },
  {
    id: 'g2',
    title: 'Garbage Collection Issue',
    description: 'Garbage has not been collected from our area for the past week.',
    category: 'sanitation',
    priority: 'high',
    status: 'pending',
    submittedDate: '2026-01-03',
    wardNumber: 3,
    location: 'Residential Area, Ward 3',
    userId: 'user123',
  },
];

export const getUserGrievances = async (req: Request, res: Response) => {
  try {
    // In real implementation, get user ID from auth middleware
    const userId = 'user123'; // Mock user ID
    
    // Filter grievances by user ID
    const userGrievances = mockGrievances.filter(g => g.userId === userId);
    
    res.json({
      success: true,
      data: userGrievances,
      count: userGrievances.length,
    });
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({
      error: 'Failed to fetch grievances',
    });
  }
};

export const createGrievance = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, description, category, priority, location, wardNumber } = req.body;
    
    // In real implementation, get user ID from auth middleware
    const userId = 'user123'; // Mock user ID
    
    // Create new grievance (mock implementation)
    const newGrievance = {
      id: `g${Date.now()}`,
      title,
      description,
      category,
      priority,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      wardNumber: wardNumber ? parseInt(wardNumber) : null,
      location: location || '',
      userId,
    };
    
    // In real implementation, save to database
    mockGrievances.push(newGrievance);
    
    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      data: newGrievance,
    });
  } catch (error) {
    console.error('Error creating grievance:', error);
    res.status(500).json({
      error: 'Failed to create grievance',
    });
  }
};

export const getGrievance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = 'user123'; // Mock user ID
    
    const grievance = mockGrievances.find(g => g.id === id && g.userId === userId);
    
    if (!grievance) {
      return res.status(404).json({
        error: 'Grievance not found',
      });
    }
    
    res.json({
      success: true,
      data: grievance,
    });
  } catch (error) {
    console.error('Error fetching grievance:', error);
    res.status(500).json({
      error: 'Failed to fetch grievance',
    });
  }
};

export const updateGrievance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = 'user123'; // Mock user ID
    
    const grievanceIndex = mockGrievances.findIndex(g => g.id === id && g.userId === userId);
    
    if (grievanceIndex === -1) {
      return res.status(404).json({
        error: 'Grievance not found',
      });
    }
    
    // Users can only update limited fields
    const allowedUpdates = ['description', 'location'];
    const updates: any = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    // Update grievance
    mockGrievances[grievanceIndex] = {
      ...mockGrievances[grievanceIndex],
      ...updates,
    };
    
    res.json({
      success: true,
      message: 'Grievance updated successfully',
      data: mockGrievances[grievanceIndex],
    });
  } catch (error) {
    console.error('Error updating grievance:', error);
    res.status(500).json({
      error: 'Failed to update grievance',
    });
  }
};