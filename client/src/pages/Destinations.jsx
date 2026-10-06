import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import api from '../api/client';
import DestinationCard from '../components/DestinationCard';

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = [
    'All',
    'Beach',
    'Mountain',
    'Heritage',
    'Nature',
    'Adventure',
    'City',
    'Island',
    'Romance',
  ];

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (sortBy) params.sort = sortBy;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/destinations', { params });
      setDestinations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [category, sortBy, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDestinations();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSortBy('rating-desc');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block">
          Worldwide Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
          Explore Destinations
        </h1>
        <p className="text-sm text-charcoal-500 max-w-2xl">
          Discover breathtaking destinations across India and across the world with transparent travel costs, verified highlights, and seasonal tips.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
        {/* Top Search & Sort Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by destination name, state, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-navy-950 placeholder-charcoal-400 focus:outline-none focus:border-ocean-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchDestinations();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
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

            {(search || category !== 'All' || maxPrice) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
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

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-charcoal-500">
            Showing <span className="text-navy-950 font-bold">{destinations.length}</span> destinations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white border border-charcoal-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-charcoal-100 shadow-soft p-8">
            <div className="w-16 h-16 rounded-2xl bg-ocean-50 text-ocean-600 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-navy-950 mb-1">No destinations found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-6">
              We couldn't find any destinations matching your current search or category filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs shadow-soft"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
