import Hotel from '../models/Hotel.js';
import Review from '../models/Review.js';

// @desc    Get all hotels with search & filters
// @route   GET /api/hotels
export const getHotels = async (req, res) => {
  try {
    const { destination, search, minPrice, maxPrice, rating, amenity, sort, featured } = req.query;
    let query = {};

    if (destination) {
      query.destinationName = { $regex: destination, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destinationName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (amenity) {
      query.amenities = { $in: [new RegExp(amenity, 'i')] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let sortOption = { rating: -1 };
    if (sort === 'price-asc') sortOption = { pricePerNight: 1 };
    if (sort === 'price-desc') sortOption = { pricePerNight: -1 };
    if (sort === 'rating-desc') sortOption = { rating: -1 };
    if (sort === 'name-asc') sortOption = { name: 1 };

    let hotels = [];
    try {
      hotels = await Hotel.find(query).sort(sortOption);
    } catch (dbErr) {
      console.warn('[VAYORA] Hotel DB query notice:', dbErr.message);
    }

    if (!hotels || hotels.length === 0) {
      const { seedHotels } = await import('../data/seedData.js');
      let fallbackList = [...seedHotels];
      if (featured === 'true') {
        fallbackList = fallbackList.filter((h) => h.featured);
      }
      hotels = fallbackList;
    }

    res.json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hotel with reviews
// @route   GET /api/hotels/:id
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('destination');
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    const reviews = await Review.find({ hotel: hotel._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        hotel,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create hotel (Admin)
// @route   POST /api/hotels
export const createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update hotel (Admin)
// @route   PUT /api/hotels/:id
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete hotel (Admin)
// @route   DELETE /api/hotels/:id
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
