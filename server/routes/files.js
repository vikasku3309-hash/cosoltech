import express from 'express';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/fileUpload.js';
import FileService from '../services/fileService.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Upload single file
router.post('/upload', authenticateAdmin, uploadSingle, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { tags, description } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    const result = await FileService.uploadFile(
      req.file,
      req.admin.email || req.admin.adminId,
      parsedTags,
      description
    );

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        file: result.file
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload multiple files
router.post('/upload-multiple', authenticateAdmin, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { tags, description } = req.body;
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    const result = await FileService.uploadMultipleFiles(
      req.files,
      req.admin.email || req.admin.adminId,
      parsedTags,
      description
    );

    res.status(201).json({
      success: result.success,
      message: result.success ? 'Files uploaded successfully' : 'Some files failed to upload',
      uploadedFiles: result.uploadedFiles,
      errors: result.errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get file by ID (download)
router.get('/download/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await FileService.getFileById(req.params.id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    const file = result.file;
    
    // Admin can download any file

    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.size
    });

    res.send(file.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get file info (metadata only)
router.get('/info/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await FileService.getFileInfo(req.params.id);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    const file = result.file;
    
    // Admin can view any file

    res.json({
      success: true,
      file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's files
router.get('/my-files', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 per page
    
    const result = await FileService.getFilesByUser(
      req.admin.email || req.admin.adminId,
      page,
      limit
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search files
router.get('/search', authenticateAdmin, async (req, res) => {
  try {
    const { q: query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const parsedPage = parseInt(page);
    const parsedLimit = Math.min(parseInt(limit), 50); // Max 50 per page
    
    const result = await FileService.searchFiles(
      query,
      req.admin.email || req.admin.adminId,
      parsedPage,
      parsedLimit
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete file
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await FileService.deleteFile(
      req.params.id,
      req.admin.email || req.admin.adminId
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get storage statistics
router.get('/stats/storage', authenticateAdmin, async (req, res) => {
  try {
    const result = await FileService.getStorageStats(
      req.admin.email || req.admin.adminId
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all resumes from job applications
router.get('/resumes', authenticateAdmin, async (req, res) => {
  try {
    const JobApplication = (await import('../models/JobApplication.js')).default;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // Find all job applications with resumes
    const applications = await JobApplication.find({ 
      'resume.data': { $exists: true } 
    })
    .select('fullName email position createdAt resume')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await JobApplication.countDocuments({ 
      'resume.data': { $exists: true } 
    });

    // Format resumes for file management display
    const resumes = applications.map(app => ({
      _id: app._id,
      filename: app.resume.filename || `${app.fullName.replace(/\s+/g, '_')}_resume.pdf`,
      originalName: app.resume.originalName || app.resume.filename,
      contentType: app.resume.contentType || 'application/pdf',
      size: app.resume.size,
      uploadedBy: app.email,
      applicantName: app.fullName,
      position: app.position,
      uploadedAt: app.createdAt,
      type: 'resume',
      source: 'job_application'
    }));

    res.json({
      success: true,
      files: resumes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes'
    });
  }
});

// Download resume from job application
router.get('/resume/:applicationId', authenticateAdmin, async (req, res) => {
  try {
    const JobApplication = (await import('../models/JobApplication.js')).default;
    const application = await JobApplication.findById(req.params.applicationId);
    
    if (!application || !application.resume || !application.resume.data) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.set({
      'Content-Type': application.resume.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${application.resume.filename || 'resume.pdf'}"`,
      'Content-Length': application.resume.size
    });

    res.send(application.resume.data);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
});

export default router;