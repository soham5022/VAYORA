import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  Sparkles,
  Star,
  Quote,
  ChevronRight,
} from 'lucide-react';
import api from '../api/client';
import DestinationCard from '../components/DestinationCard';
import PackageCard from '../components/PackageCard';
import HotelCard from '../components/HotelCard';
import ActivityCard from '../components/ActivityCard';
import BookingModal from '../components/BookingModal';

import {
  fallbackDestinations,
  fallbackPackages,
  fallbackHotels,
  fallbackActivities,
} from '../data/fallbackData';

export default function Home() {
  const navigate = useNavigate();

  // Search state
  const [searchDestination, setSearchDestination] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTravelers, setSearchTravelers] = useState(2);

  // Data states - Preloaded for instantaneous 0ms rendering (Stale-While-Revalidate pattern)
  const [destinations, setDestinations] = useState(() => fallbackDestinations.slice(0, 6));
  const [packages, setPackages] = useState(() => fallbackPackages.slice(0, 4));
  const [hotels, setHotels] = useState(() => fallbackHotels.slice(0, 4));
  const [activities, setActivities] = useState(() => fallbackActivities.slice(0, 4));
  const [loading, setLoading] = useState(false);

  // Booking modal for quick book
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [bookingModalType, setBookingModalType] = useState('package');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, pkgRes, hotelRes, actRes] = await Promise.all([
          api.get('/destinations?featured=true').catch(() => ({ data: { data: [] } })),
          api.get('/packages?featured=true').catch(() => ({ data: { data: [] } })),
          api.get('/hotels?featured=true').catch(() => ({ data: { data: [] } })),
          api.get('/activities?featured=true').catch(() => ({ data: { data: [] } })),
        ]);

        const destList = destRes.data.data?.slice(0, 6) || [];
        const pkgList = pkgRes.data.data?.slice(0, 4) || [];
        const hotelList = hotelRes.data.data?.slice(0, 4) || [];
        const actList = actRes.data.data?.slice(0, 4) || [];

        setDestinations(destList.length > 0 ? destList : fallbackDestinations.slice(0, 6));
        setPackages(pkgList.length > 0 ? pkgList : fallbackPackages.slice(0, 4));
        setHotels(hotelList.length > 0 ? hotelList : fallbackHotels.slice(0, 4));
        setActivities(actList.length > 0 ? actList : fallbackActivities.slice(0, 4));
      } catch (err) {
        console.error('Home data load failed, using fallback catalog:', err.message);
        setDestinations(fallbackDestinations.slice(0, 6));
        setPackages(fallbackPackages.slice(0, 4));
        setHotels(fallbackHotels.slice(0, 4));
        setActivities(fallbackActivities.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchDestination.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchDestination.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="VAYORA Travel Paradise"
            className="w-full h-full object-cover brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/40 to-charcoal-50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-ocean-200 text-xs sm:text-sm font-semibold tracking-wide animate-in fade-in duration-700">
            <Sparkles className="w-4 h-4 text-sunset-400" />
            <span>Discover Unforgettable Journeys Across India & Beyond</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-serif leading-[1.1] max-w-4xl mx-auto drop-shadow-md">
            Your next journey starts here.
          </h1>

          <p className="text-lg sm:text-xl text-charcoal-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover places worth remembering. Explore world-class luxury stays, handpicked packages, and smart custom itineraries.
          </p>

          {/* Search Box Card */}
          <div className="max-w-4xl mx-auto pt-4">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-elevated border border-white/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-left"
            >
              {/* Destination Input */}
              <div className="sm:col-span-5 px-3 py-2 rounded-2xl hover:bg-charcoal-50 transition-colors">
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-ocean-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Where do you want to go? (e.g. Kashmir, Goa, Dubai)"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-navy-950 placeholder-charcoal-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dates Input */}
              <div className="sm:col-span-3 px-3 py-2 rounded-2xl hover:bg-charcoal-50 transition-colors border-t sm:border-t-0 sm:border-l border-charcoal-100">
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Travel Date
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-ocean-600 flex-shrink-0" />
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-navy-950 focus:outline-none"
                  />
                </div>
              </div>

              {/* Travelers */}
              <div className="sm:col-span-2 px-3 py-2 rounded-2xl hover:bg-charcoal-50 transition-colors border-t sm:border-t-0 sm:border-l border-charcoal-100">
                <label className="block text-[11px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                  Travelers
                </label>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-ocean-600 flex-shrink-0" />
                  <select
                    value={searchTravelers}
                    onChange={(e) => setSearchTravelers(parseInt(e.target.value))}
                    className="bg-transparent text-sm font-semibold text-navy-950 focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num > 1 ? 'Guests' : 'Guest'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block mb-1">
              Top Trending
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif">
              Popular Destinations
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:text-ocean-700 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-charcoal-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED TRAVEL PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sunset-600 uppercase tracking-widest block mb-1">
              All-Inclusive Trails
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif">
              Featured Travel Packages
            </h2>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:text-ocean-700 group"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* 4. SMART TRIP PLANNER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-8 sm:p-12 lg:p-16 shadow-elevated">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset-500/20 text-sunset-400 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Itinerary Engine
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif leading-tight">
              Design your dream trip in seconds.
            </h2>
            <p className="text-charcoal-300 text-sm sm:text-base leading-relaxed">
              Pick your preferred destinations, dates, budget, and travel interests. Our smart trip planner generates day-by-day schedules with estimated costs, hotel recommendations, and adventure activities.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/trip-planner"
                className="px-6 py-3.5 rounded-xl bg-sunset-500 hover:bg-sunset-600 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all flex items-center gap-2 group"
              >
                <span>Launch Trip Planner</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/destinations"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all"
              >
                Browse Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POPULAR HOTELS & RESORTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block mb-1">
              Handpicked Luxury
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif">
              Popular Hotels & Resorts
            </h2>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:text-ocean-700 group"
          >
            <span>Explore All Hotels</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* 6. TOP EXPERIENCES & ACTIVITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
              Thrills & Heritage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-serif">
              Unforgettable Experiences
            </h2>
          </div>
          <Link
            to="/activities"
            className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:text-ocean-700 group"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((act) => (
            <ActivityCard
              key={act._id}
              activity={act}
              onBookNow={(selected) => {
                setBookingModalItem(selected);
                setBookingModalType('activity');
              }}
            />
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE VAYORA */}
      <section className="bg-charcoal-100/60 py-16 border-y border-charcoal-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-ocean-600 uppercase tracking-widest block">
              The VAYORA Standard
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 font-serif">
              Why Discerning Travelers Choose Us
            </h2>
            <p className="text-sm text-charcoal-500">
              We curate experiences that go far beyond standard itineraries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Curated Escapes</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Hand-vetted villas, resorts, and scenic expeditions ensuring exceptional quality standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sunset-50 text-sunset-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Intelligent Planning</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Interactive trip building tool that crafts personalized day-by-day itineraries matched to your style.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Transparent Pricing</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                No hidden resort fees or surprise booking markups. What you see is what you pay.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950">Concierge Service</h3>
              <p className="text-xs text-charcoal-500 leading-relaxed">
                Dedicated travel specialists and seamless booking cancellation management through your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-sunset-600 uppercase tracking-widest block">
            Traveler Stories
          </span>
          <h2 className="text-3xl font-extrabold text-navy-950 font-serif">
            Loved by Adventurers Across the Globe
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Arjun Kulkarni',
              location: 'Mumbai, India',
              quote: 'Our family tour to Kashmir through VAYORA was flawless. The Dal Lake houseboat and Gulmarg Gondola coordination was seamless!',
              trip: 'Kashmir Paradise Package',
              rating: 5,
            },
            {
              name: 'Elena Rostova',
              location: 'Dubai, UAE',
              quote: 'The trip planner saved me hours of research for Bali. We stayed in an incredible pool villa in Ubud and enjoyed private surf lessons.',
              trip: 'Bali Romance & Ubud Retreat',
              rating: 5,
            },
            {
              name: 'Pooja & Rohan Mehta',
              location: 'Bengaluru, India',
              quote: 'Booking Taj Exotica Goa on VAYORA was swift and transparent. The instant booking confirmation and clean printable invoice were top tier.',
              trip: 'Taj Exotica Resort Goa',
              rating: 5,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-sunset-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-charcoal-600 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-950">{item.name}</h4>
                  <p className="text-[11px] text-charcoal-400">{item.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-ocean-700 bg-ocean-50 px-2 py-1 rounded-md">
                  {item.trip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK BOOKING MODAL */}
      <BookingModal
        isOpen={!!bookingModalItem}
        onClose={() => setBookingModalItem(null)}
        item={bookingModalItem}
        type={bookingModalType}
      />
    </div>
  );
}
