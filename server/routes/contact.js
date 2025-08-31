import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { sendReplyEmail } from '../utils/emailService.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { uploadMultiple, handleUploadError } from '../middleware/fileUpload.js';

const router = express.Router();

// Submit contact form
router.post('/submit', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5 }).withMessage('Subject must be at least 5 characters long'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, subject, message, phone } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      phone
    });

    await contact.save();

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contactId: contact._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
});

// Get all contacts (admin only)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const { limit = 50, status, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Get single contact (admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ contact });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Failed to fetch contact' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateAdmin, [
  body('status').isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ 
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Failed to update contact status' });
  }
});

// Reply to contact with file attachments (admin only)
router.post('/:id/reply', authenticateAdmin, uploadMultiple, handleUploadError, [
  body('message').trim().isLength({ min: 10 }).withMessage('Reply message must be at least 10 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { message } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
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

    // Send reply email
    await sendReplyEmail({
      to: contact.email,
      subject: contact.subject,
      message,
      attachments,
      replyTo: contact.message
    });

    // Update contact with reply
    const reply = {
      message,
      attachments,
      sentBy: 'admin',
      sentAt: new Date()
    };

    contact.replies.push(reply);
    contact.status = 'replied';
    contact.lastRepliedAt = new Date();
    await contact.save();

    res.json({ 
      message: 'Reply sent successfully',
      contact
    });
  } catch (error) {
    console.error('Send reply error:', error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

export default router;