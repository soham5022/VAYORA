import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
    },
    destinationName: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    category: {
      type: String,
      enum: ['Adventure', 'Food', 'Nature', 'Culture', 'Photography', 'Water sports', 'Relaxation', 'Romance', 'Sightseeing'],
      required: true,
      default: 'Adventure',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    duration: {
      type: String,
      default: '3 Hours',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ name: 'text', destinationName: 'text', category: 'text' });

export default mongoose.model('Activity', activitySchema);
