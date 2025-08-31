import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
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
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
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
  }
});

export default mongoose.model('Contact', contactSchema);