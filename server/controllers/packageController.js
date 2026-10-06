import Package from '../models/Package.js';
import Review from '../models/Review.js';

// @desc    Get all packages with search & filters
// @route   GET /api/packages
export const getPackages = async (req, res) => {
  try {
    const { destination, search, minPrice, maxPrice, duration, rating, sort, featured } = req.query;
    let query = {};

    if (destination) {
      query.destinationName = { $regex: destination, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destinationName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (duration) {
      // e.g. "3-5" days or exact
      if (duration === 'short') query.durationDays = { $lte: 4 };
      else if (duration === 'medium') query.durationDays = { $gt: 4, $lte: 7 };
      else if (duration === 'long') query.durationDays = { $gt: 7 };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { rating: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating-desc') sortOption = { rating: -1 };
    if (sort === 'duration-asc') sortOption = { durationDays: 1 };

    let packages = [];
    try {
      packages = await Package.find(query).sort(sortOption);
    } catch (dbErr) {
      console.warn('[VAYORA] Package DB query notice:', dbErr.message);
    }

    if (!packages || packages.length === 0) {
      const { seedPackages } = await import('../data/seedData.js');
      let fallbackList = [...seedPackages];
      if (featured === 'true') {
        fallbackList = fallbackList.filter((p) => p.featured);
      }
      packages = fallbackList;
    }

    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package with reviews
// @route   GET /api/packages/:id
export const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination');
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const reviews = await Review.find({ package: pkg._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        package: pkg,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create package (Admin)
// @route   POST /api/packages
export const createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update package (Admin)
// @route   PUT /api/packages/:id
export const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete package (Admin)
// @route   DELETE /api/packages/:id
export const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
