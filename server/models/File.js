import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true,
    max: 200000, // 200KB limit
    validate: {
      validator: function(v) {
        return v <= 200000;
      },
      message: 'File size cannot exceed 200KB'
    }
  },
  data: {
    type: Buffer,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  }
});

// Index for efficient queries
fileSchema.index({ uploadedBy: 1, uploadedAt: -1 });
fileSchema.index({ contentType: 1 });
fileSchema.index({ tags: 1 });

export default mongoose.model('File', fileSchema);