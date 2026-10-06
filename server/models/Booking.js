import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['package', 'hotel', 'activity'],
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
    destination: {
      type: String,
      default: '',
    },
    itemName: {
      type: String,
      required: true,
    },
    itemImage: {
      type: String,
      default: '',
    },
    travelDate: {
      type: Date,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    travelers: {
      type: Number,
      default: 1,
      min: 1,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    roomType: {
      type: String,
      default: '',
    },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card (Demo)',
    },
    paymentId: {
      type: String,
      default: '',
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
