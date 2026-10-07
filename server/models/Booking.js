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
      index: true,
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
    // Server-side Pricing Breakdown
    basePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRatePercent: {
      type: Number,
      default: 5.0, // 5% GST
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: '',
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Payment Gateway Details
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refund Requested', 'Refunded', 'Failed'],
      default: 'Paid',
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Credit Card / UPI',
    },
    paymentId: {
      type: String,
      default: '',
    },
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    razorpaySignature: {
      type: String,
      default: '',
    },
    // Booking Lifecycle
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled', 'Refund Requested', 'Refunded'],
      default: 'Confirmed',
      index: true,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ['None', 'Initiated', 'Processed', 'Rejected'],
      default: 'None',
    },
    invoiceNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
