import Activity from '../models/Activity.js';
import Review from '../models/Review.js';

// @desc    Get all activities with search & filters
// @route   GET /api/activities
export const getActivities = async (req, res) => {
  try {
    const { destination, category, search, minPrice, maxPrice, rating, sort, featured } = req.query;
    let query = {};

    if (destination) {
      query.destinationName = { $regex: destination, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
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
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
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
    if (sort === 'name-asc') sortOption = { name: 1 };

    let activities = [];
    try {
      activities = await Activity.find(query).sort(sortOption);
    } catch (dbErr) {
      console.warn('[VAYORA] Activity DB query notice:', dbErr.message);
    }

    if (!activities || activities.length === 0) {
      const { seedActivities } = await import('../data/seedData.js');
      let fallbackList = [...seedActivities];
      if (category && category !== 'All') {
        fallbackList = fallbackList.filter((a) => a.category.toLowerCase() === category.toLowerCase());
      }
      if (featured === 'true') {
        fallbackList = fallbackList.filter((a) => a.featured);
      }
      activities = fallbackList;
    }

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    let activity = null;
    let reviews = [];

    const mongoose = (await import('mongoose')).default;
    if (mongoose.isValidObjectId(id)) {
      try {
        activity = await Activity.findById(id).populate('destination');
        if (activity) {
          reviews = await Review.find({ activity: activity._id })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        }
      } catch (dbErr) {
        console.warn('[VAYORA] Activity DB lookup notice:', dbErr.message);
      }
    }

    if (!activity) {
      const { seedActivities } = await import('../data/seedData.js');
      const cleanId = String(id).toLowerCase();
      activity =
        seedActivities.find((a) => a._id === id || String(a.id) === id) ||
        seedActivities.find((a) => a.name.toLowerCase().includes(cleanId)) ||
        seedActivities.find((a) => cleanId.includes(a.destinationName.toLowerCase())) ||
        seedActivities[0];
    }

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.json({
      success: true,
      data: {
        activity,
        reviews: reviews || [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create activity (Admin)
// @route   POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update activity (Admin)
// @route   PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete activity (Admin)
// @route   DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
