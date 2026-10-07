import BlogPost from '../models/BlogPost.js';

// Fallback blog guides for instant zero-latency view
const fallbackPosts = [
  {
    _id: 'blog_1',
    title: 'The Art of Slow Travel: Why Experiencing Less Means Remembering More',
    slug: 'the-art-of-slow-travel',
    excerpt: 'How shifting away from checklist tourism and embracing mindful exploration unlocks authentic connections and unforgettable memories.',
    content: `In an era dominated by hyper-speed itineraries and Instagram-driven bucket lists, the true essence of travel often gets lost in transit. Slow travel is a philosophy that encourages travelers to connect more deeply with the destinations they visit—savoring local cuisine, engaging with artisans, and staying in boutique properties that honor their heritage.\n\n### The Antidote to Travel Fatigue\nWhen we rush through six cities in ten days, the sights blur together into a hurried collage. By choosing instead to anchor in a single region—such as the serene valleys of Pahalgam or the tranquil spice estates of Kerala—we give ourselves permission to breathe, discover hidden alleyways, and build memories that outlast fleeting photo opportunities.\n\n### Curating Your Slow Journey with VAYORA\nAt VAYORA, our private bespoke itineraries are designed with intentional pauses. From sunrise private boat rides to quiet evening tea overlooking the snowline, we believe luxury is time well spent.`,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'Travel Tips',
    tags: ['Mindfulness', 'Slow Travel', 'Luxury', 'Curated Journeys'],
    readTime: '6 min read',
    published: true,
    views: 1420,
    createdAt: new Date('2026-03-10'),
  },
  {
    _id: 'blog_2',
    title: 'Kashmir Beyond the Postcard: An Insider Guide to the Valley of Shepherds',
    slug: 'kashmir-insider-guide-valley-of-shepherds',
    excerpt: 'Uncover the secret pine glades of Aru, heritage Shikara craft traditions on Dal Lake, and authentic Wazwan culinary mastery.',
    content: `Revered across centuries as paradise on earth, Kashmir carries an aura of poetry and timeless mountain majesty. While the gardens of Srinagar and the slopes of Gulmarg are rightfully celebrated, the deeper valley holds secrets accessible only to discerning travelers.\n\n### Secret Meadows of Aru & Betaab\nBeyond the main township of Pahalgam, the Aru Valley opens up like an Alpine sanctuary. Towering deodars, roaring glacial streams, and nomadic Gujjar settlements create an enchanting backdrop for guided day-hikes and picnic lunches arranged by VAYORA private concierges.\n\n### Wazwan: A 36-Course Royal Feast\nNo visit to Kashmir is complete without experiencing the artistry of a traditional Wazwan. Prepared by master chefs (Wazas), delicacies such as Rogan Josh, Rista, and saffron-infused Kahwa represent hundreds of years of royal culinary heritage.`,
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    category: 'Destination Guides',
    tags: ['Kashmir', 'Himalayas', 'Culture', 'Gourmet'],
    readTime: '8 min read',
    published: true,
    views: 2890,
    createdAt: new Date('2026-02-24'),
  },
  {
    _id: 'blog_3',
    title: 'Top 7 Overwater Villa Experiences Around the World',
    slug: 'top-7-overwater-villa-experiences',
    excerpt: 'From retractable roofs for midnight stargazing in the Maldives to private lagoons in the South Pacific, discover pure aquatic luxury.',
    content: `There is a distinctive magic to waking up surrounded by 360 degrees of turquoise ocean. Overwater villas represent the pinnacle of bespoke coastal indulgence.\n\n### 1. Soneva Jani, Maldives\nEquipped with slides that plunge directly into lagoon waters and retractable roofs above the master bedroom, Soneva Jani redefines barefoot luxury with sustainable architectural brilliance.\n\n### 2. Four Seasons Bora Bora\nPerched above tranquil South Pacific coral atolls with unbroken panoramas of Mount Otemanu, these Polynesian bungalows combine traditional thatched craftsmanship with five-star world amenities.\n\nBooking with VAYORA guarantees complimentary daily breakfast, private seaplane transfers, and dedicated 24/7 personal butler service.`,
    coverImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    category: 'Luxury Stays',
    tags: ['Maldives', 'Villas', 'Honeymoon', 'Luxury'],
    readTime: '5 min read',
    published: true,
    views: 3410,
    createdAt: new Date('2026-01-18'),
  },
];

// @desc    Get all blog posts
// @route   GET /api/blog
export const getBlogPosts = async (req, res) => {
  try {
    const { category, tag } = req.query;
    const filter = { published: true };
    if (category && category !== 'All') filter.category = category;
    if (tag) filter.tags = tag;

    const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
    if (posts.length > 0) {
      return res.json({ success: true, count: posts.length, data: posts });
    }
    res.json({ success: true, count: fallbackPosts.length, data: fallbackPosts });
  } catch {
    res.json({ success: true, count: fallbackPosts.length, data: fallbackPosts });
  }
};

// @desc    Get single blog post by slug or ID
// @route   GET /api/blog/:slug
export const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let post = await BlogPost.findOne({ $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }] });

    if (!post) {
      post = fallbackPosts.find((p) => p.slug === slug || p._id === slug) || fallbackPosts[0];
    }

    if (post && post.save) {
      post.views += 1;
      await post.save().catch(() => {});
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create blog post (Admin)
// @route   POST /api/blog
export const createBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog post (Admin)
// @route   PUT /api/blog/:id
export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog post (Admin)
// @route   DELETE /api/blog/:id
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
