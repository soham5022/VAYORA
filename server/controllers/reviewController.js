import Review from '../models/Review.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';

// @desc    Get reviews with optional entity filter
// @route   GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const { destination, package: pkgId, hotel, activity } = req.query;
    let query = {};

    if (destination) query.destination = destination;
    if (pkgId) query.package = pkgId;
    if (hotel) query.hotel = hotel;
    if (activity) query.activity = activity;

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
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

// @desc    Submit a review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { destination, package: pkgId, hotel, activity, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({
      user: req.user._id,
      destination: destination || undefined,
      package: pkgId || undefined,
      hotel: hotel || undefined,
      activity: activity || undefined,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Owner or Admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
