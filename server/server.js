import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

// Import routes
import contactRoutes from './routes/contact.js';
import jobApplicationRoutes from './routes/jobApplication.js';
import adminRoutes from './routes/admin.js';
import fileRoutes from './routes/files.js';

dotenv.config();

// Main server initialization function
async function initializeServer() {
  // Import auth routes based on environment
  let authRoutes;
  try {
    if (process.env.NODE_ENV === 'development') {
      const authModule = await import('./routes/auth.js');
      authRoutes = authModule.default;
    } else {
      const authModule = await import('./routes/auth-dev.js');
      authRoutes = authModule.default;
    }
  } catch (error) {
    console.error('Error importing auth routes:', error);
    // Fallback to development routes
    const authModule = await import('./routes/auth.js');
    authRoutes = authModule.default;
  }

  const app = express();

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

  // CORS configuration
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:8081',
        'http://localhost:8082',
        'https://cosoltech.in',
        'https://www.cosoltech.in',
        'https://cosoltech.vercel.app',
        'https://backend.cosoltech.in',
        process.env.CLIENT_URL
      ].filter(Boolean);
      
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  };

  // Middleware
  app.use(cors(corsOptions));

  // Handle preflight requests explicitly
  app.options('*', cors(corsOptions));

  // CORS debugging middleware
  app.use((req, res, next) => {
    console.log('Request origin:', req.headers.origin);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/', limiter);

  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/complete_solution_tech')
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/job-applications', jobApplicationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/files', fileRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
  });

  // CORS test endpoint
  app.get('/api/cors-test', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'CORS is working!',
      origin: req.headers.origin,
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Handle CORS errors specifically
    if (err.message && err.message.includes('CORS')) {
      return res.status(403).json({
        message: 'CORS Error',
        error: err.message,
        allowedOrigins: [
          'https://cosoltech.in',
          'https://www.cosoltech.in',
          'https://cosoltech.vercel.app',
          'https://backend.cosoltech.in'
        ]
      });
    }
    
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the server
initializeServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});