import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import paymentService from '../services/paymentService.js';
import emailService from '../services/emailService.js';
import { fallbackPackages, fallbackHotels, fallbackActivities } from '../data/fallbackCatalog.js';

// Generate production format booking ID: VY-2026-XXXXXX
const generateBookingId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `VY-${year}-${random}`;
};

// @desc    Create new booking with real backend price calculation & coupon validation
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const {
      type,
      itemId,
      travelDate,
      checkIn,
      checkOut,
      travelers = 1,
      guests = 1,
      roomType,
      contactInfo,
      couponCode = '',
      paymentMethod = 'Credit Card / UPI',
      razorpayPaymentId = '',
      razorpaySignature = '',
      razorpayOrderId = '',
    } = req.body;

    if (!type || !itemId || !contactInfo?.name || !contactInfo?.email) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
    }

    let basePrice = 0;
    let quantity = 1;
    let itemName = '';
    let itemImage = '';
    let destination = '';
    let packageId = null;
    let hotelId = null;
    let activityId = null;

    // 1. Resolve Item & Real Base Price
    if (type === 'package') {
      let pkg = null;
      if (mongoose.isValidObjectId(itemId)) {
        pkg = await Package.findById(itemId);
      }
      if (!pkg) {
        pkg = fallbackPackages.find((p) => p._id === itemId || String(p.id) === itemId || p.name.toLowerCase().includes(String(itemId).toLowerCase())) || fallbackPackages[0];
      }
      packageId = mongoose.isValidObjectId(pkg._id) ? pkg._id : null;
      itemName = pkg.name;
      itemImage = pkg.images?.[0] || '';
      destination = pkg.destinationName;
      basePrice = pkg.price;
      quantity = Math.max(1, Number(travelers));
    } else if (type === 'hotel') {
      let hotel = null;
      if (mongoose.isValidObjectId(itemId)) {
        hotel = await Hotel.findById(itemId);
      }
      if (!hotel) {
        hotel = fallbackHotels.find((h) => h._id === itemId || String(h.id) === itemId || h.name.toLowerCase().includes(String(itemId).toLowerCase())) || fallbackHotels[0];
      }
      hotelId = mongoose.isValidObjectId(hotel._id) ? hotel._id : null;
      itemName = hotel.name;
      itemImage = hotel.images?.[0] || '';
      destination = hotel.destinationName;

      let nights = 1;
      if (checkIn && checkOut) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        nights = diffDays > 0 ? diffDays : 1;
      }

      let nightPrice = hotel.pricePerNight;
      if (roomType && hotel.rooms?.length > 0) {
        const selectedRoom = hotel.rooms.find((r) => r.roomType === roomType);
        if (selectedRoom) nightPrice = selectedRoom.pricePerNight;
      }
      basePrice = nightPrice;
      quantity = nights;
    } else if (type === 'activity') {
      let activity = null;
      if (mongoose.isValidObjectId(itemId)) {
        activity = await Activity.findById(itemId);
      }
      if (!activity) {
        activity = fallbackActivities.find((a) => a._id === itemId || String(a.id) === itemId || a.name.toLowerCase().includes(String(itemId).toLowerCase())) || fallbackActivities[0];
      }
      activityId = mongoose.isValidObjectId(activity._id) ? activity._id : null;
      itemName = activity.name;
      itemImage = activity.images?.[0] || '';
      destination = activity.destinationName;
      basePrice = activity.price;
      quantity = Math.max(1, Number(travelers || guests));
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }

    // 2. Strict Server-Side Pricing Breakdown
    const subtotal = Math.round(basePrice * quantity);
    const taxRatePercent = 5.0; // 5% GST
    const taxAmount = Math.round((subtotal * taxRatePercent) / 100);
    const serviceFee = Math.round((subtotal * 2.5) / 100); // 2.5% platform fee

    // 3. Coupon Validation
    let discountAmount = 0;
    let appliedCoupon = null;
    if (couponCode && couponCode.trim()) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
      if (coupon) {
        const check = coupon.isValidForOrder(subtotal, req.user?._id);
        if (check.valid) {
          discountAmount = coupon.calculateDiscount(subtotal);
          appliedCoupon = coupon;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal + taxAmount + serviceFee - discountAmount);

    // 4. Verify Payment if Razorpay credentials supplied
    let paymentStatus = 'Paid';
    if (razorpayPaymentId) {
      const isValidSig = paymentService.verifyPaymentSignature({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
      if (!isValidSig) {
        paymentStatus = 'Pending';
      }
    }

    const uniqueBookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId: uniqueBookingId,
      user: req.user._id,
      type,
      package: packageId,
      hotel: hotelId,
      activity: activityId,
      destination,
      itemName,
      itemImage,
      travelDate: travelDate || checkIn || new Date(),
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      travelers: Number(travelers),
      guests: Number(guests),
      roomType: roomType || '',
      contactInfo,
      basePrice,
      quantity,
      subtotal,
      taxRatePercent,
      taxAmount,
      serviceFee,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      discountAmount,
      totalAmount,
      paymentStatus,
      paymentMethod,
      paymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      bookingStatus: 'Confirmed',
      invoiceNumber: `INV-${uniqueBookingId.replace('VY-', '')}`,
    });

    // Record coupon usage
    if (appliedCoupon) {
      appliedCoupon.timesUsed += 1;
      appliedCoupon.usedBy.push({ user: req.user._id, usedAt: new Date() });
      await appliedCoupon.save().catch(() => {});
    }

    // Create In-App Notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed 🎉',
      message: `Your booking for ${itemName} has been confirmed. Booking ID: ${uniqueBookingId}`,
      type: 'booking',
      link: `/booking/confirmation/${booking._id}`,
      metadata: { bookingId: uniqueBookingId },
    }).catch(() => {});

    // Send Confirmation Email
    emailService.sendBookingConfirmation({
      to: contactInfo.email,
      booking,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created and confirmed successfully',
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating booking' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'name images duration price')
      .populate('hotel', 'name images pricePerNight location')
      .populate('activity', 'name images price duration')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by ID (Mongoose ID or human Booking ID)
// @route   GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (mongoose.isValidObjectId(id)) {
      booking = await Booking.findById(id)
        .populate('package')
        .populate('hotel')
        .populate('activity')
        .populate('user', 'name email phone');
    }

    if (!booking) {
      booking = await Booking.findOne({ bookingId: id })
        .populate('package')
        .populate('hotel')
        .populate('activity')
        .populate('user', 'name email phone');
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only allow owner or admin
    if (booking.user?._id?.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking invoice voucher data
// @route   GET /api/bookings/:id/invoice
export const getBookingInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    let booking = null;

    if (mongoose.isValidObjectId(id)) {
      booking = await Booking.findById(id).populate('user', 'name email phone address');
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id }).populate('user', 'name email phone address');
    }
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const invoiceData = {
      invoiceNumber: booking.invoiceNumber || `INV-${booking.bookingId}`,
      issueDate: booking.createdAt,
      bookingId: booking.bookingId,
      company: {
        name: 'VAYORA Travel Technologies Pvt Ltd',
        tagline: 'Travel beyond the ordinary',
        gstin: '29AAACV5912K1Z8',
        email: 'billing@vayora.com',
        phone: '+91 800-829-6721',
        address: 'Level 14, Prestige Blue Tower, Outer Ring Road, Bengaluru, Karnataka 560103',
      },
      customer: {
        name: booking.contactInfo.name,
        email: booking.contactInfo.email,
        phone: booking.contactInfo.phone,
      },
      serviceDetails: {
        type: booking.type,
        itemName: booking.itemName,
        destination: booking.destination,
        travelDate: booking.travelDate || booking.checkIn,
        quantity: booking.quantity,
        travelers: booking.travelers || booking.guests,
      },
      pricing: {
        basePrice: booking.basePrice,
        quantity: booking.quantity,
        subtotal: booking.subtotal,
        taxAmount: booking.taxAmount,
        serviceFee: booking.serviceFee,
        couponCode: booking.couponCode,
        discountAmount: booking.discountAmount,
        totalAmount: booking.totalAmount,
      },
      payment: {
        status: booking.paymentStatus,
        method: booking.paymentMethod,
        transactionId: booking.paymentId,
      },
    };

    res.json({ success: true, data: invoiceData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by traveler' } = req.body;

    let booking = null;
    if (mongoose.isValidObjectId(id)) {
      booking = await Booking.findById(id);
    }
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    // Calculate policy refund (e.g. 100% if > 48hrs, 50% otherwise)
    const travelDate = new Date(booking.travelDate || booking.checkIn || Date.now());
    const hoursRemaining = (travelDate - new Date()) / (1000 * 60 * 60);

    let refundAmount = 0;
    if (hoursRemaining >= 48) {
      refundAmount = booking.totalAmount;
    } else if (hoursRemaining > 24) {
      refundAmount = Math.round(booking.totalAmount * 0.5);
    }

    booking.bookingStatus = 'Cancelled';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? 'Initiated' : 'None';
    booking.paymentStatus = refundAmount > 0 ? 'Refunded' : booking.paymentStatus;
    await booking.save();

    // Process refund with payment service
    if (refundAmount > 0) {
      paymentService.processRefund({
        paymentId: booking.paymentId,
        amount: refundAmount,
        notes: { bookingId: booking.bookingId, reason },
      }).catch(() => {});
    }

    // Send cancellation email
    emailService.sendCancellationNotice({
      to: booking.contactInfo.email,
      booking,
    }).catch(() => {});

    // Send Notification
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.itemName} (${booking.bookingId}) has been cancelled. Refund: ₹${refundAmount.toLocaleString('en-IN')}`,
      type: 'booking',
      link: `/dashboard/bookings`,
    }).catch(() => {});

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
