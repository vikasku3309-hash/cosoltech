import File from '../models/File.js';
import crypto from 'crypto';
import path from 'path';

class FileService {
  // Upload a single file to MongoDB
  static async uploadFile(fileData, uploadedBy, tags = [], description = '') {
    try {
      // Validate file size
      if (fileData.buffer.length > 200000) {
        throw new Error('File size exceeds 200KB limit');
      }

      // Generate unique filename
      const fileExtension = path.extname(fileData.originalname);
      const uniqueName = crypto.randomUUID() + fileExtension;

      const file = new File({
        filename: uniqueName,
        originalName: fileData.originalname,
        contentType: fileData.mimetype,
        size: fileData.buffer.length,
        data: fileData.buffer,
        uploadedBy,
        tags,
        description
      });

      await file.save();
      
      // Return file info without the buffer data
      const { data, ...fileInfo } = file.toObject();
      return {
        success: true,
        file: fileInfo
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(filesData, uploadedBy, tags = [], description = '') {
    try {
      const uploadResults = [];
      const errors = [];

      for (const fileData of filesData) {
        const result = await this.uploadFile(fileData, uploadedBy, tags, description);
        if (result.success) {
          uploadResults.push(result.file);
        } else {
          errors.push({
            filename: fileData.originalname,
            error: result.message
          });
        }
      }

      return {
        success: errors.length === 0,
        uploadedFiles: uploadResults,
        errors: errors
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get file by ID
  static async getFileById(fileId) {
    try {
      const file = await File.findById(fileId);
      if (!file) {
        return {
          success: false,
          message: 'File not found'
        };
      }

      return {
        success: true,
        file
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get file info without binary data
  static async getFileInfo(fileId) {
    try {
      const file = await File.findById(fileId).select('-data');
      if (!file) {
        return {
          success: false,
          message: 'File not found'
        };
      }

      return {
        success: true,
        file
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get files by user
  static async getFilesByUser(uploadedBy, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const files = await File.find({ uploadedBy })
        .select('-data')
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await File.countDocuments({ uploadedBy });

      return {
        success: true,
        files,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Search files by tags or filename
  static async searchFiles(query, uploadedBy = null, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const searchConditions = {
        $or: [
          { originalName: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { description: { $regex: query, $options: 'i' } }
        ]
      };

      if (uploadedBy) {
        searchConditions.uploadedBy = uploadedBy;
      }

      const files = await File.find(searchConditions)
        .select('-data')
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await File.countDocuments(searchConditions);

      return {
        success: true,
        files,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Delete file
  static async deleteFile(fileId, uploadedBy) {
    try {
      const file = await File.findOneAndDelete({ 
        _id: fileId, 
        uploadedBy 
      });

      if (!file) {
        return {
          success: false,
          message: 'File not found or you do not have permission to delete it'
        };
      }

      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Get storage statistics for a user
  static async getStorageStats(uploadedBy) {
    try {
      const stats = await File.aggregate([
        { $match: { uploadedBy } },
        {
          $group: {
            _id: null,
            totalFiles: { $sum: 1 },
            totalSize: { $sum: '$size' },
            avgSize: { $avg: '$size' }
          }
        }
      ]);

      const fileTypes = await File.aggregate([
        { $match: { uploadedBy } },
        {
          $group: {
            _id: '$contentType',
            count: { $sum: 1 },
            totalSize: { $sum: '$size' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        stats: stats[0] || { totalFiles: 0, totalSize: 0, avgSize: 0 },
        fileTypes
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default FileService;