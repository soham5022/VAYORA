import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Archived'],
      default: 'New',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ContactInquiry', contactInquirySchema);
