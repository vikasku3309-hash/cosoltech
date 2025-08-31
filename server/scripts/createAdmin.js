import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

async function createFirstAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/complete_solution_tech');
    
    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Admin already exists!');
      process.exit(1);
    }

    // Create first admin
    const admin = new Admin({
      username: 'admin',
      email: 'info.cosoltech@gmail.com',
      password: 'Viekaysh@123', // Change this in production!
      role: 'super_admin'
    });

    await admin.save();
    console.log('First admin created successfully!');
    console.log('Username: admin');
    console.log('Password: Viekaysh@123');
    console.log('Please change the password after first login!');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createFirstAdmin();