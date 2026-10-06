import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';

// Helper to generate readable booking ID
const generateBookingId = () => {
  const prefix = 'VAY';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${timestamp}${random}`;
};

// @desc    Create new booking
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
      paymentMethod = 'Credit Card (Demo)',
    } = req.body;

    if (!type || !itemId || !contactInfo?.name || !contactInfo?.email) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
    }

    let calculatedTotal = 0;
    let itemName = '';
    let itemImage = '';
    let destination = '';
    let packageId = null;
    let hotelId = null;
    let activityId = null;

    if (type === 'package') {
      const pkg = await Package.findById(itemId);
      if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
      packageId = pkg._id;
      itemName = pkg.name;
      itemImage = pkg.images?.[0] || '';
      destination = pkg.destinationName;
      calculatedTotal = pkg.price * Number(travelers);
    } else if (type === 'hotel') {
      const hotel = await Hotel.findById(itemId);
      if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
      hotelId = hotel._id;
      itemName = hotel.name;
      itemImage = hotel.images?.[0] || '';
      destination = hotel.destinationName;

      // Calculate nights
      let nights = 1;
      if (checkIn && checkOut) {
        const diffMs = new Date(checkOut) - new Date(checkIn);
        nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }
      
      let rate = hotel.pricePerNight;
      if (roomType) {
        const selectedRoom = hotel.rooms.find((r) => r.roomType === roomType);
        if (selectedRoom) rate = selectedRoom.pricePerNight;
      }
      calculatedTotal = rate * nights;
    } else if (type === 'activity') {
      const act = await Activity.findById(itemId);
      if (!act) return res.status(404).json({ success: false, message: 'Activity not found' });
      activityId = act._id;
      itemName = act.name;
      itemImage = act.images?.[0] || '';
      destination = act.destinationName;
      calculatedTotal = act.price * Number(travelers);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }

    const bookingId = generateBookingId();
    const paymentId = `PAY-DEMO-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      type,
      package: packageId,
      hotel: hotelId,
      activity: activityId,
      destination,
      itemName,
      itemImage,
      travelDate: travelDate || checkIn || new Date(),
      checkIn,
      checkOut,
      travelers: Number(travelers) || 1,
      guests: Number(guests) || 1,
      roomType: roomType || '',
      contactInfo,
      totalAmount: calculatedTotal,
      paymentStatus: 'Paid',
      paymentMethod,
      paymentId,
      bookingStatus: 'Confirmed',
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('package', 'duration')
      .populate('hotel', 'rating')
      .populate('activity', 'category');

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('package')
      .populate('hotel')
      .populate('activity');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Authorization: owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled and demo refund initiated',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
