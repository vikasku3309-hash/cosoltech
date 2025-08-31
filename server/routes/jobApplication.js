import express from 'express';
import { body, validationResult } from 'express-validator';
import JobApplication from '../models/JobApplication.js';
import { sendJobApplicationResponse } from '../utils/emailService.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadMultiple, uploadSingle, handleUploadError } from '../middleware/fileUpload.js';

const router = express.Router();

// Submit job application
router.post('/submit', uploadSingle, handleUploadError, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long'),
  body('position').trim().isLength({ min: 2 }).withMessage('Position must be at least 2 characters long'),
  body('experience').trim().isLength({ min: 1 }).withMessage('Experience must be selected'),
  body('coverLetter').optional().trim().isLength({ min: 10 }).withMessage('Cover letter must be at least 10 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { fullName, email, phone, position, experience, coverLetter } = req.body;

    // Process resume file if uploaded
    let resume = null;
    if (req.file && req.file.buffer.length <= 200000) { // 200KB limit
      resume = {
        filename: req.file.originalname,
        originalName: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.buffer.length,
        data: req.file.buffer
      };
    }

    const application = new JobApplication({
      fullName,
      email,
      phone,
      position,
      experience,
      coverLetter,
      resume
    });

    await application.save();

    res.status(201).json({ 
      message: 'Job application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Job application submission error:', error);
    res.status(500).json({ message: 'Failed to submit job application' });
  }
});

// Get all job applications (admin only)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, status, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await JobApplication.countDocuments(query);
    
    res.json({
      applications,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get single job application (admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }
    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

// Update job application status (admin only)
router.patch('/:id/status', authenticateAdmin, [
  body('status').isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']).withMessage('Invalid status'),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status, notes } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json({ 
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

// Reply to job application with file attachments (admin only)
router.post('/:id/reply', authenticateAdmin, uploadMultiple, handleUploadError, [
  body('message').trim().isLength({ min: 10 }).withMessage('Reply message must be at least 10 characters long'),
  body('status').optional().isIn(['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message, status } = req.body;
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Process uploaded files to MongoDB format
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.buffer.length <= 200000) { // 200KB limit
          attachments.push({
            filename: file.originalname,
            originalName: file.originalname,
            contentType: file.mimetype,
            size: file.buffer.length,
            data: file.buffer
          });
        }
      }
    }

    // Send response email
    await sendJobApplicationResponse({
      to: application.email,
      fullName: application.fullName,
      position: application.position,
      message,
      attachments,
      status: status || application.status
    });

    // Update application with reply
    const reply = {
      message,
      attachments,
      sentBy: 'admin',
      sentAt: new Date()
    };

    application.replies.push(reply);
    if (status) {
      application.status = status;
    }
    application.lastRepliedAt = new Date();
    await application.save();

    res.json({ 
      message: 'Reply sent successfully',
      application
    });
  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

export default router;