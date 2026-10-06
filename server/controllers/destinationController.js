import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activity.js';
import Review from '../models/Review.js';

// @desc    Get all destinations with search & filter
// @route   GET /api/destinations
export const getDestinations = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, rating, sort, featured } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { rating: -1 };
    if (sort === 'price-asc') sortOption = { startingPrice: 1 };
    if (sort === 'price-desc') sortOption = { startingPrice: -1 };
    if (sort === 'rating-desc') sortOption = { rating: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };

    let destinations = [];
    try {
      destinations = await Destination.find(query).sort(sortOption);
    } catch (dbErr) {
      console.warn('[VAYORA] Destination DB query notice:', dbErr.message);
    }

    if (!destinations || destinations.length === 0) {
      const { seedDestinations } = await import('../data/seedData.js');
      let fallbackList = [...seedDestinations];
      if (category && category !== 'All') {
        fallbackList = fallbackList.filter((d) => d.category === category);
      }
      if (featured === 'true') {
        fallbackList = fallbackList.filter((d) => d.featured);
      }
      destinations = fallbackList;
    }

    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single destination with linked packages, hotels, activities, reviews
// @route   GET /api/destinations/:id
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Find linked entities by destination ID or name
    const [packages, hotels, activities, reviews] = await Promise.all([
      Package.find({
        $or: [{ destination: destination._id }, { destinationName: { $regex: destination.name, $options: 'i' } }],
      }),
      Hotel.find({
        $or: [{ destination: destination._id }, { destinationName: { $regex: destination.name, $options: 'i' } }],
      }),
      Activity.find({
        $or: [{ destination: destination._id }, { destinationName: { $regex: destination.name, $options: 'i' } }],
      }),
      Review.find({ destination: destination._id }).populate('user', 'name avatar').sort({ createdAt: -1 }),
    ]);

    res.json({
      success: true,
      data: {
        destination,
        packages,
        hotels,
        activities,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new destination (Admin)
// @route   POST /api/destinations
export const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update destination (Admin)
// @route   PUT /api/destinations/:id
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete destination (Admin)
// @route   DELETE /api/destinations/:id
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
