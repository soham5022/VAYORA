import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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
    durationNights: {
      type: Number,
      default: 4,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    discountPercent: {
      type: Number,
      default: 0,
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
    cancellationPolicy: {
      type: String,
      default: 'Free cancellation up to 48 hours before departure. 50% refund between 48 and 24 hours.',
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

packageSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

packageSchema.index({ name: 'text', destinationName: 'text', description: 'text' });

export default mongoose.model('Package', packageSchema);
