import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['destination', 'package', 'hotel', 'activity'],
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
