import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Hotel as HotelIcon, MapPin, X } from 'lucide-react';
import api from '../api/client';
import HotelCard from '../components/HotelCard';
import { fallbackHotels } from '../data/fallbackData';

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [hotels, setHotels] = useState(() => fallbackHotels);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [amenity, setAmenity] = useState('all');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [maxPrice, setMaxPrice] = useState('');

  const amenities = [
    { id: 'all', name: 'All Amenities' },
    { id: 'Pool', name: 'Swimming Pool' },
    { id: 'Spa', name: 'Spa & Wellness' },
    { id: 'Beach', name: 'Private Beach' },
    { id: 'Dining', name: 'Fine Dining' },
    { id: 'Wi-Fi', name: 'Free Wi-Fi' },
  ];

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (amenity !== 'all') params.amenity = amenity;
      if (sortBy) params.sort = sortBy;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/hotels', { params });
      const list = res.data.data || [];
      if (list.length > 0 || search.trim() || amenity !== 'all' || maxPrice) {
        setHotels(list);
      } else {
        setHotels(fallbackHotels);
      }
    } catch (err) {
      console.error('Failed to load hotels:', err);
      setHotels(fallbackHotels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [amenity, sortBy, maxPrice]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  const handleReset = () => {
    setSearch('');
    setAmenity('all');
    setSortBy('rating-desc');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block">
          Handpicked Stays
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
          Luxury Hotels & Resorts
        </h1>
        <p className="text-sm text-charcoal-500 max-w-2xl">
          From overwater villas in Maldives to royal heritage palaces in Rajasthan and snow-view mountain lodges in Gulmarg.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search hotels by property name, city, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-navy-950 placeholder-charcoal-400 focus:outline-none focus:border-ocean-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchHotels();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:border-ocean-600 cursor-pointer"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              onClick={handleReset}
              className="w-full py-2.5 text-xs font-semibold text-charcoal-600 hover:text-navy-950 bg-charcoal-50 hover:bg-charcoal-100 rounded-2xl transition-colors text-center"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Amenity Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {amenities.map((item) => (
            <button
              key={item.id}
              onClick={() => setAmenity(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                amenity === item.id
                  ? 'bg-navy-900 text-white shadow-soft'
                  : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100 hover:text-navy-900'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-charcoal-500">
            Showing <span className="text-navy-950 font-bold">{hotels.length}</span> luxury properties
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-white border border-charcoal-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-charcoal-100 shadow-soft p-8">
            <HotelIcon className="w-12 h-12 text-ocean-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950 mb-1">No hotels found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
              Try modifying your search or amenity filter.
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
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
