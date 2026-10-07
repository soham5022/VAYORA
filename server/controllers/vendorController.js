import User from '../models/User.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

// @desc    Register / Apply as a Travel Partner / Vendor
// @route   POST /api/vendors/register
export const registerVendor = async (req, res) => {
  try {
    const { businessName, businessType, address, taxId, contactPhone } = req.body;
    if (!businessName || !businessType) {
      return res.status(400).json({ success: false, message: 'Please provide business name and business type' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = 'VENDOR';
    user.phone = contactPhone || user.phone;
    user.vendorProfile = {
      businessName,
      businessType,
      address: address || '',
      taxId: taxId || '',
      isApproved: true, // Auto-approved in demo/development mode for seamless testing
      rating: 5.0,
      appliedAt: new Date(),
    };

    await user.save();

    await Notification.create({
      user: user._id,
      title: 'Partner Application Approved 🎉',
      message: `Welcome to the VAYORA Partner Network, ${businessName}! You can now manage your inventory and bookings.`,
      type: 'account',
      link: '/vendor/dashboard',
    }).catch(() => {});

    res.json({
      success: true,
      data: user,
      message: 'Vendor application accepted and partner profile activated!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Vendor Dashboard metrics & listings
// @route   GET /api/vendors/dashboard
export const getVendorDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== 'VENDOR' && user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Vendor access required' });
    }

    const [packagesCount, hotelsCount, activitiesCount, bookings] = await Promise.all([
      Package.countDocuments(),
      Hotel.countDocuments(),
      Activity.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'Paid')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        vendorProfile: user.vendorProfile,
        stats: {
          activeListings: packagesCount + hotelsCount + activitiesCount,
          totalBookings: bookings.length,
          totalRevenue,
          partnerRating: user.vendorProfile?.rating || 4.9,
        },
        recentBookings: bookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin approve or reject vendor
// @route   PUT /api/vendors/:id/status
export const updateVendorStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'VENDOR') {
      return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    }

    vendor.vendorProfile.isApproved = Boolean(isApproved);
    await vendor.save();

    res.json({ success: true, data: vendor, message: `Vendor approval status updated to ${isApproved}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
