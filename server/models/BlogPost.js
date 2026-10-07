import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      name: { type: String, default: 'VAYORA Editorial Team' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      role: { type: String, default: 'Chief Travel Curator' },
    },
    category: {
      type: String,
      enum: ['Destination Guides', 'Travel Tips', 'Luxury Stays', 'Adventure', 'Culture & Heritage', 'Seasonal'],
      default: 'Destination Guides',
      index: true,
    },
    tags: [String],
    readTime: {
      type: String,
      default: '5 min read',
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BlogPost', blogPostSchema);
