import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  resume: {
    filename: String,
    originalName: String,
    contentType: String,
    size: {
      type: Number,
      max: 200000 // 200KB limit
    },
    data: Buffer // BSON binary data
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  notes: {
    type: String
  },
  // Reply tracking
  replies: [{
    message: {
      type: String,
      required: true
    },
    attachments: [{
      filename: String,
      originalName: String,
      contentType: String,
      size: {
        type: Number,
        max: 200000 // 200KB limit
      },
      data: Buffer // BSON binary data
    }],
    sentBy: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastRepliedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
      default: Date.now
  }
});

jobApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('JobApplication', jobApplicationSchema);