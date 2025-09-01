import express from 'express';
import { body, validationResult } from 'express-validator';
import JobApplication from '../models/JobApplication.js';
import { sendJobApplicationResponse } from '../utils/emailService.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadMultiple, uploadSingle, uploadAnySingle, handleUploadError } from '../middleware/fileUpload.js';

const router = express.Router();

// Submit job application
router.post('/submit', uploadAnySingle, handleUploadError, [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').trim().matches(/[\d\+\-\s\(\)]{10,}/).withMessage('Please provide a valid phone number'),
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
    
    console.log('Job application submission attempt:', { fullName, email, phone, position, experience });

    // Check if JobApplication model is available
    if (!JobApplication) {
      console.error('JobApplication model is not available');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Process resume file if uploaded
    let resume = null;
    if (req.files && req.files.length > 0) {
      // Find the resume file
      const resumeFile = req.files.find(file => file.fieldname === 'resume');
      if (resumeFile && resumeFile.buffer.length <= 200000) { // 200KB limit
        resume = {
          filename: resumeFile.originalname,
          originalName: resumeFile.originalname,
          contentType: resumeFile.mimetype,
          size: resumeFile.buffer.length,
          data: resumeFile.buffer
        };
      }
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

    console.log('Attempting to save job application to database...');
    await application.save();
    console.log('Job application saved successfully:', application._id);

    res.status(201).json({ 
      success: true,
      message: 'Job application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    console.error('Job application submission error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return more specific error information in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to submit job application: ${error.message}`
      : 'Failed to submit job application';
      
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
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

// Delete job application (admin only) - also deletes associated resume
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // The resume is embedded in the application document, so it's automatically deleted
    res.json({ 
      success: true,
      message: 'Job application and associated resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Failed to delete job application' });
  }
});

// Delete multiple job applications (admin only)
router.post('/delete-multiple', authenticateAdmin, [
  body('ids').isArray().withMessage('IDs must be an array'),
  body('ids.*').isMongoId().withMessage('Invalid application ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { ids } = req.body;
    
    const result = await JobApplication.deleteMany({ _id: { $in: ids } });
    
    res.json({ 
      success: true,
      message: `${result.deletedCount} application(s) and their resumes deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete multiple applications error:', error);
    res.status(500).json({ message: 'Failed to delete job applications' });
  }
});

export default router;