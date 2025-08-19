import express from 'express';
import { body, validationResult } from 'express-validator';
import JobApplication from '../models/JobApplication.js';
import { sendEmailNotification } from '../utils/emailService.js';

const router = express.Router();

// Validation middleware
const validateApplication = [
  body('fullName').notEmpty().trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty().isMobilePhone(),
  body('position').notEmpty(),
  body('experience').notEmpty(),
  body('coverLetter').optional().trim()
];

// Submit job application
router.post('/submit', validateApplication, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, phone, position, experience, coverLetter } = req.body;

    // Save to database
    const application = new JobApplication({
      fullName,
      email,
      phone,
      position,
      experience,
      coverLetter
    });

    await application.save();

    // Send email notification to admin
    await sendEmailNotification({
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application: ${position}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Cover Letter:</strong></p>
        <p>${coverLetter || 'Not provided'}</p>
      `
    });

    // Send confirmation email to applicant
    await sendEmailNotification({
      to: email,
      subject: 'Application Received - Complete Solution Technology',
      html: `
        <h2>Thank you for your application!</h2>
        <p>Dear ${fullName},</p>
        <p>We have received your application for the position of ${position}.</p>
        <p>Our HR team will review your application and get back to you if your profile matches our requirements.</p>
        <p>Best regards,<br>HR Team<br>Complete Solution Technology</p>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully!'
    });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application. Please try again.'
    });
  }
});

// Get all applications (admin only)
router.get('/all', async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Update application status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application status' });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

export default router;