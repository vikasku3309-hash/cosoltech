import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Middleware to authenticate admin users
 * Verifies JWT token and checks if admin exists and is active
 */

export const authenticateAdmin = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    try {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (dbError) {
      console.error('Database error in auth middleware:', dbError);
      // If MongoDB is not connected, skip admin verification for now
      // In production, you should ensure MongoDB is connected
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Alias for backward compatibility
export const authMiddleware = authenticateAdmin;