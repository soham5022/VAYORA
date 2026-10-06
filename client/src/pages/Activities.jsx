import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import api from '../api/client';
import ActivityCard from '../components/ActivityCard';
import BookingModal from '../components/BookingModal';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');

  const [bookingModalItem, setBookingModalItem] = useState(null);

  const categories = [
    'All',
    'Adventure',
    'Water sports',
    'Food',
    'Nature',
    'Culture',
    'Photography',
    'Romance',
  ];

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (sortBy) params.sort = sortBy;

      const res = await api.get('/activities', { params });
      setActivities(res.data.data || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [category, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchActivities();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setSortBy('rating-desc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">
          Experiences & Adventures
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
          Curated Travel Experiences
        </h1>
        <p className="text-sm text-charcoal-500 max-w-2xl">
          From scuba diving in Goa and hot air ballooning in Jaipur to glacier hikes in Switzerland and dune safaris in Dubai.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by activity name, adventure type, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-navy-950 placeholder-charcoal-400 focus:outline-none focus:border-ocean-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchActivities();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-charcoal-50 border border-charcoal-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:border-ocean-600 cursor-pointer"
          >
            <option value="rating-desc">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-navy-900 text-white shadow-soft'
                  : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100 hover:text-navy-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-charcoal-500">
            Showing <span className="text-navy-950 font-bold">{activities.length}</span> curated adventures
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white border border-charcoal-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-charcoal-100 shadow-soft p-8">
            <Sparkles className="w-12 h-12 text-ocean-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950 mb-1">No activities found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
              Try exploring different categories or modifying your keywords.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((act) => (
              <ActivityCard
                key={act._id}
                activity={act}
                onBookNow={(selected) => setBookingModalItem(selected)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!bookingModalItem}
        onClose={() => setBookingModalItem(null)}
        item={bookingModalItem}
        type="activity"
      />
    </div>
  );
}
