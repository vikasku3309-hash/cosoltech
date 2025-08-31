import express from 'express';
import Contact from '../models/Contact.js';
import JobApplication from '../models/JobApplication.js';
import File from '../models/File.js';
import FileService from '../services/fileService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authMiddleware);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [
      totalContacts,
      newContacts,
      totalApplications,
      pendingApplications,
      recentContacts,
      recentApplications
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: 'pending' }),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      JobApplication.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Get monthly stats for charts
    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    const monthlyContacts = await Contact.aggregate([
      { $match: { createdAt: { $gte: lastMonthDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const monthlyApplications = await JobApplication.aggregate([
      { $match: { createdAt: { $gte: lastMonthDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      stats: {
        totalContacts,
        newContacts,
        totalApplications,
        pendingApplications
      },
      recentActivity: {
        contacts: recentContacts,
        applications: recentApplications
      },
      charts: {
        monthlyContacts,
        monthlyApplications
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Get all contacts with pagination
router.get('/contacts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = status ? { status } : {};
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Get all job applications with pagination
router.get('/applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const position = req.query.position;
    
    const query = {};
    if (status) query.status = status;
    if (position) query.position = position;
    
    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    const total = await JobApplication.countDocuments(query);
    
    res.json({
      applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// File Management Routes

// Get all files with pagination and search
router.get('/files', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const search = req.query.search;
    const userFilter = req.query.user;
    
    let query = {};
    if (userFilter) {
      query.uploadedBy = userFilter;
    }
    
    let files;
    let total;
    
    if (search) {
      // Use search functionality
      const searchResult = await FileService.searchFiles(search, userFilter, page, limit);
      if (searchResult.success) {
        files = searchResult.files;
        total = searchResult.pagination.total;
      } else {
        throw new Error(searchResult.message);
      }
    } else {
      // Regular pagination
      files = await File.find(query)
        .select('-data') // Exclude binary data for listing
        .sort({ uploadedAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      
      total = await File.countDocuments(query);
    }
    
    res.json({
      files,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Files fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

// Get file storage statistics
router.get('/files/stats', async (req, res) => {
  try {
    // Overall storage stats
    const overallStats = await File.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$size' },
          avgSize: { $avg: '$size' }
        }
      }
    ]);

    // Files by user
    const userStats = await File.aggregate([
      {
        $group: {
          _id: '$uploadedBy',
          fileCount: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { fileCount: -1 } },
      { $limit: 10 }
    ]);

    // Files by type
    const typeStats = await File.aggregate([
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 },
          totalSize: { $sum: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overall: overallStats[0] || { totalFiles: 0, totalSize: 0, avgSize: 0 },
      byUser: userStats,
      byType: typeStats
    });
  } catch (error) {
    console.error('File stats error:', error);
    res.status(500).json({ message: 'Failed to fetch file statistics' });
  }
});

// Download file (admin can download any file)
router.get('/files/:id/download', async (req, res) => {
  try {
    const result = await FileService.getFileById(req.params.id);
    
    if (!result.success) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = result.file;
    
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.size
    });

    res.send(file.data);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// Delete file (admin can delete any file)
router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await File.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: `File "${file.originalName}" deleted successfully` 
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// Bulk delete files
router.delete('/files/bulk', async (req, res) => {
  try {
    const { fileIds } = req.body;
    
    if (!fileIds || !Array.isArray(fileIds)) {
      return res.status(400).json({ message: 'File IDs array is required' });
    }

    const result = await File.deleteMany({ _id: { $in: fileIds } });
    
    res.json({ 
      success: true, 
      message: `${result.deletedCount} files deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Bulk file deletion error:', error);
    res.status(500).json({ message: 'Failed to delete files' });
  }
});

export default router;