import express from 'express';
import Contact from '../models/Contact.js';
import JobApplication from '../models/JobApplication.js';
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

export default router;