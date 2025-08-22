import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock admin user for development
const mockAdmin = {
  _id: 'dev_admin_123',
  username: 'admin',
  email: 'admin@completesolutiontech.com',
  password: 'admin123', // In real app this would be hashed
  role: 'super_admin',
  isActive: true
};

// Login validation
const validateLogin = [
  body('username').notEmpty().trim(),
  body('password').isLength({ min: 6 })
];

// Admin login (development mock)
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Simple mock authentication
    if (username !== mockAdmin.username || password !== mockAdmin.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: mockAdmin._id, username: mockAdmin.username, role: mockAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: mockAdmin._id,
        username: mockAdmin.username,
        email: mockAdmin.email,
        role: mockAdmin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current admin info (mock)
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      _id: decoded.adminId,
      username: decoded.username,
      email: mockAdmin.email,
      role: decoded.role,
      isActive: true
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;