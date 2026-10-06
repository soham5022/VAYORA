import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Review from '../models/Review.js';

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/dashboard
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      totalDestinations,
      totalPackages,
      totalHotels,
      totalActivities,
      recentBookings,
      allBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Booking.countDocuments(),
      Destination.countDocuments(),
      Package.countDocuments(),
      Hotel.countDocuments(),
      Activity.countDocuments(),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('user', 'name email avatar'),
      Booking.find().select('totalAmount paymentStatus bookingStatus createdAt type destination'),
    ]);

    // Calculate revenue metrics
    let totalRevenue = 0;
    let pendingBookings = 0;
    let cancelledBookings = 0;
    let confirmedBookings = 0;

    allBookings.forEach((b) => {
      if (b.paymentStatus === 'Paid') {
        totalRevenue += b.totalAmount || 0;
      }
      if (b.bookingStatus === 'Pending') pendingBookings++;
      if (b.bookingStatus === 'Cancelled') cancelledBookings++;
      if (b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Completed') confirmedBookings++;
    });

    // Monthly revenue simulation/grouping
    const monthlyRevenue = [
      { month: 'Jan', revenue: Math.round(totalRevenue * 0.12) },
      { month: 'Feb', revenue: Math.round(totalRevenue * 0.15) },
      { month: 'Mar', revenue: Math.round(totalRevenue * 0.18) },
      { month: 'Apr', revenue: Math.round(totalRevenue * 0.22) },
      { month: 'May', revenue: Math.round(totalRevenue * 0.19) },
      { month: 'Jun', revenue: Math.round(totalRevenue * 0.14) },
    ];

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalDestinations,
        totalPackages,
        totalHotels,
        totalActivities,
        totalRevenue,
        pendingBookings,
        cancelledBookings,
        confirmedBookings,
        recentBookings,
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone avatar')
      .populate('package', 'name duration')
      .populate('hotel', 'name rating')
      .populate('activity', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/admin/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (bookingStatus) booking.bookingStatus = bookingStatus;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();
    res.json({ success: true, message: 'Booking status updated successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for moderation (Admin)
// @route   GET /api/admin/reviews
export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .populate('destination', 'name')
      .populate('package', 'name')
      .populate('hotel', 'name')
      .populate('activity', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
