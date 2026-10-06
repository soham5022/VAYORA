import Wishlist from '../models/Wishlist.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: wishlist.length, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { itemType, itemId, title, image, location, price, rating } = req.body;

    if (!itemType || !itemId || !title) {
      return res.status(400).json({ success: false, message: 'Missing required wishlist fields' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Item already in wishlist', data: existing });
    }

    const item = await Wishlist.create({
      user: req.user._id,
      itemType,
      itemId,
      title,
      image: image || '',
      location: location || '',
      price: price || 0,
      rating: rating || 4.8,
    });

    res.status(201).json({ success: true, message: 'Added to wishlist', data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    // Check by _id or by itemId
    const deleted = await Wishlist.findOneAndDelete({
      user: req.user._id,
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { itemId: id }],
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    res.json({ success: true, message: 'Removed from wishlist', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
