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
    // Get JWT_SECRET with fallback for production
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET environment variable is not set, using fallback');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);

    // Simple mock authentication - support multiple passwords for compatibility
    const validPasswords = ['admin123', 'Viekaysh@123'];
    if (username !== mockAdmin.username || !validPasswords.includes(password)) {
      console.log('Invalid credentials for username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { adminId: mockAdmin._id, username: mockAdmin.username, role: mockAdmin.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('Login successful for admin:', username);

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
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current admin info (mock)
router.get('/me', (req, res) => {
  try {
    // Get JWT_SECRET with fallback for production
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET environment variable is not set, using fallback');
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    res.json({
      _id: decoded.adminId,
      username: decoded.username,
      email: mockAdmin.email,
      role: decoded.role,
      isActive: true
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;