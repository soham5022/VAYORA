import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Clock, Filter, X, Package as PackageIcon } from 'lucide-react';
import api from '../api/client';
import PackageCard from '../components/PackageCard';
import { fallbackPackages } from '../data/fallbackData';

export default function Packages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialDest = searchParams.get('destination') || '';

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [destinationFilter, setDestinationFilter] = useState(initialDest);
  const [duration, setDuration] = useState('all');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (destinationFilter.trim()) params.destination = destinationFilter.trim();
      if (duration !== 'all') params.duration = duration;
      if (sortBy) params.sort = sortBy;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get('/packages', { params });
      const list = res.data.data || [];
      if (list.length > 0 || search.trim() || destinationFilter.trim() || maxPrice) {
        setPackages(list);
      } else {
        setPackages(fallbackPackages);
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
      setPackages(fallbackPackages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [duration, sortBy, maxPrice, destinationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPackages();
  };

  const handleReset = () => {
    setSearch('');
    setDestinationFilter('');
    setDuration('all');
    setSortBy('rating-desc');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-sunset-600 uppercase tracking-widest block">
          All-Inclusive Trails
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
          Curated Travel Packages
        </h1>
        <p className="text-sm text-charcoal-500 max-w-2xl">
          Complete vacation packages including hand-picked luxury resort accommodations, guided tours, local sightseeing, and transfers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <form onSubmit={handleSearchSubmit} className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search packages by name, highlights, or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-navy-950 placeholder-charcoal-400 focus:outline-none focus:border-ocean-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchPackages();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Duration Filter */}
          <div className="sm:col-span-3">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:border-ocean-600 cursor-pointer"
            >
              <option value="all">All Durations</option>
              <option value="short">Short (≤ 4 Days)</option>
              <option value="medium">Medium (5 – 7 Days)</option>
              <option value="long">Long (7+ Days)</option>
            </select>
          </div>

          {/* Sort */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:border-ocean-600 cursor-pointer"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Shortest First</option>
            </select>

            {(search || destinationFilter || duration !== 'all' || maxPrice) && (
              <button
                onClick={handleReset}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm font-semibold text-charcoal-500">
            Showing <span className="text-navy-950 font-bold">{packages.length}</span> verified holiday packages
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-white border border-charcoal-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-charcoal-100 shadow-soft p-8">
            <PackageIcon className="w-12 h-12 text-ocean-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy-950 mb-1">No packages found</h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
              Try adjusting your duration, search terms, or price filters.
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
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
