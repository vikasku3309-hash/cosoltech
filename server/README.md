# Complete Solution Technology Backend

Backend API server for Complete Solution Technology website with MongoDB integration, email notifications, and admin dashboard.

## Features

- 📧 Contact form submissions with email notifications
- 💼 Job application management
- 👨‍💼 Admin dashboard with authentication
- 🔒 JWT-based authentication
- 📊 Dashboard analytics and stats
- ✉️ Email notifications using Nodemailer

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the `.env` file and configure the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/complete_solution_tech
JWT_SECRET=your_jwt_secret_key_here_change_in_production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@completesolutiontech.com
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup
Make sure MongoDB is installed and running on your system:
```bash
# Start MongoDB service
mongod
```

### 4. Email Configuration
For Gmail SMTP:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Google Account > Security > 2-Step Verification > App Passwords
3. Use the generated app password in EMAIL_PASS

### 5. Create First Admin User
```bash
npm run create-admin
```
This will create an admin user with:
- Username: `admin`
- Password: `admin123`

**⚠️ Important: Change the password after first login!**

### 6. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Contact Form
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/all` - Get all contacts (admin only)
- `PATCH /api/contact/:id/status` - Update contact status

### Job Applications
- `POST /api/job-applications/submit` - Submit job application
- `GET /api/job-applications/all` - Get all applications (admin only)
- `PATCH /api/job-applications/:id/status` - Update application status

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `POST /api/auth/logout` - Logout

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/contacts` - Paginated contacts
- `GET /api/admin/applications` - Paginated applications

## Admin Dashboard Access

1. Navigate to: `http://localhost:5173/admin/login`
2. Login with the admin credentials
3. Access the dashboard at: `http://localhost:5173/admin/dashboard`

## Database Schema

### Contact
- name, email, phone, subject, message
- status: new, read, replied, archived
- createdAt

### JobApplication
- fullName, email, phone, position, experience
- coverLetter, resumeUrl, notes
- status: pending, reviewing, shortlisted, rejected, hired
- createdAt, updatedAt

### Admin
- username, email, password (hashed)
- role: admin, super_admin
- isActive, lastLogin, createdAt

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Request rate limiting
- Input validation
- CORS configuration
- Environment variable protection

## Production Deployment

1. Set NODE_ENV=production
2. Use strong JWT_SECRET
3. Configure proper SMTP settings
4. Set up MongoDB with authentication
5. Use HTTPS in production
6. Configure proper CORS origins