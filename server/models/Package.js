import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
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
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      default: '5 Days / 4 Nights',
    },
    durationDays: {
      type: Number,
      default: 5,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    maxTravelers: {
      type: Number,
      default: 10,
    },
    included: {
      type: [String],
      default: ['Luxury Hotel Stay', 'Daily Breakfast', 'Airport Transfers', 'Guided City Tour'],
    },
    excluded: {
      type: [String],
      default: ['International/Domestic Flights', 'Personal Expenses', 'Travel Insurance'],
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        meals: { type: String, default: 'Breakfast' },
        stay: { type: String, default: '4-Star Resort' },
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
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

packageSchema.index({ name: 'text', destinationName: 'text', description: 'text' });

export default mongoose.model('Package', packageSchema);
