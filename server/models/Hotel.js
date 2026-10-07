import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
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
    rating: {
      type: Number,
      default: 4.7,
      min: 0,
      max: 5,
    },
    amenities: {
      type: [String],
      default: ['Free Wi-Fi', 'Swimming Pool', 'Spa & Wellness', 'Fine Dining', 'Airport Shuttle', 'Gym'],
    },
    rooms: [
      {
        roomType: { type: String, required: true },
        pricePerNight: { type: Number, required: true },
        capacity: { type: Number, default: 2 },
        bedType: { type: String, default: 'King Bed' },
        amenities: { type: [String], default: ['Free Wi-Fi', 'AC', 'Balcony', 'Room Service'] },
        available: { type: Boolean, default: true },
      },
    ],
    pricePerNight: {
      type: Number,
      required: [true, 'Base price per night is required'],
    },
    location: {
      type: String,
      required: [true, 'Location address is required'],
    },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
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

hotelSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

hotelSchema.index({ name: 'text', destinationName: 'text', location: 'text' });

export default mongoose.model('Hotel', hotelSchema);
