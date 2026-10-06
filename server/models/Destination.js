import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required'],
    },
    bestTimeToVisit: {
      type: String,
      default: 'October to March',
    },
    attractions: {
      type: [String],
      default: [],
    },
    activities: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['Beach', 'Mountain', 'Heritage', 'Wildlife', 'City', 'Romance', 'Desert', 'Island', 'Nature', 'Adventure'],
      default: 'Beach',
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

destinationSchema.index({ name: 'text', country: 'text', state: 'text', description: 'text' });

export default mongoose.model('Destination', destinationSchema);
