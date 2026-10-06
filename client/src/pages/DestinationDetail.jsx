import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  DollarSign,
  Heart,
  Compass,
  Package,
  Hotel,
  Sparkles,
  ArrowRight,
  MessageSquarePlus,
  CheckCircle,
  Share2,
} from 'lucide-react';
import api from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import PackageCard from '../components/PackageCard';
import HotelCard from '../components/HotelCard';
import ActivityCard from '../components/ActivityCard';
import ReviewModal from '../components/ReviewModal';
import BookingModal from '../components/BookingModal';

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review & Booking Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [bookingModalType, setBookingModalType] = useState('activity');

  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/destinations/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load destination:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-charcoal-500">Loading destination details...</p>
      </div>
    );
  }

  if (!data || !data.destination) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Destination not found</h2>
        <Link to="/destinations" className="text-sm font-bold text-ocean-600 underline">
          Back to all destinations
        </Link>
      </div>
    );
  }

  const { destination, packages, hotels, activities, reviews } = data;
  const isFav = isInWishlist(destination._id);

  const handleWishlistToggle = () => {
    toggleWishlist({
      itemType: 'destination',
      itemId: destination._id,
      title: destination.name,
      image: destination.images?.[0] || '',
      location: `${destination.state ? destination.state + ', ' : ''}${destination.country}`,
      price: destination.startingPrice,
      rating: destination.rating,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Destination link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. HERO HEADER & IMAGE GALLERY */}
      <div className="space-y-6">
        {/* Top Info Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>
                {destination.state ? `${destination.state}, ` : ''}
                {destination.country}
              </span>
              <span>•</span>
              <span className="text-charcoal-500">{destination.category}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 font-serif">
              {destination.name}
            </h1>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-xs ${
                isFav
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-charcoal-200 text-charcoal-700 hover:border-charcoal-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-600' : ''}`} />
              <span>{isFav ? 'Saved' : 'Wishlist'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl border border-charcoal-200 bg-white hover:bg-charcoal-50 text-charcoal-700"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <Link
              to={`/trip-planner?destination=${encodeURIComponent(destination.name)}`}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white font-bold text-xs shadow-soft flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Plan Trip Here</span>
            </Link>
          </div>
        </div>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-premium">
          <div className="lg:col-span-2 aspect-[16/10] bg-charcoal-100 overflow-hidden">
            <img
              src={destination.images?.[selectedImage] || destination.images?.[0]}
              alt={destination.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            {destination.images?.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === idx ? 'border-ocean-500 scale-[0.98]' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. KEY METRICS & ESSENTIAL INFO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-charcoal-100 shadow-soft">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Overall Rating
          </span>
          <div className="flex items-center gap-1.5 text-navy-950 font-extrabold text-lg">
            <Star className="w-5 h-5 fill-sunset-500 text-sunset-500" />
            <span>{destination.rating?.toFixed(1) || '4.9'} / 5.0</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Starting Price
          </span>
          <div className="text-navy-950 font-extrabold text-lg">
            {formatCurrency(destination.startingPrice)}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Best Season to Visit
          </span>
          <div className="text-navy-950 font-bold text-sm truncate">
            {destination.bestTimeToVisit || 'October – March'}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Category
          </span>
          <div className="text-ocean-700 font-bold text-sm">
            {destination.category} Getaway
          </div>
        </div>
      </div>

      {/* 3. ABOUT & HIGHLIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Attractions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-navy-950">About {destination.name}</h2>
            <p className="text-charcoal-600 text-sm leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>
          </div>

          {/* Popular Attractions */}
          {destination.attractions?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-navy-950">Key Attractions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.attractions.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-charcoal-50 border border-charcoal-100 text-xs font-semibold text-charcoal-800"
                  >
                    <CheckCircle className="w-4 h-4 text-ocean-600 flex-shrink-0" />
                    <span>{att}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Things to do */}
          {destination.activities?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-navy-950">Signature Things to Do</h2>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((act, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-ocean-50 text-ocean-700 font-semibold text-xs border border-ocean-100"
                  >
                    ✨ {act}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick Travel Widget */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-navy-950 to-navy-900 text-white p-6 sm:p-8 rounded-3xl shadow-premium space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-ocean-300 font-bold block mb-1">
                Explore Packages & Hotels
              </span>
              <h3 className="text-xl font-bold text-white">Ready to visit {destination.name}?</h3>
            </div>

            <p className="text-xs text-charcoal-300 leading-relaxed">
              We offer pre-packaged holiday trails, hand-selected luxury hotel resorts, and thrilling private adventures with full price transparency.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="#packages-section"
                className="w-full py-3 px-4 rounded-xl bg-white text-navy-950 hover:bg-ocean-50 font-bold text-xs flex items-center justify-between transition-colors shadow-soft"
              >
                <span>View {packages?.length || 0} Holiday Packages</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#hotels-section"
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>View {hotels?.length || 0} Stays & Resorts</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LINKED TRAVEL PACKAGES */}
      {packages?.length > 0 && (
        <section id="packages-section" className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-sunset-600 uppercase tracking-widest block mb-1">
                Curated Trips
              </span>
              <h2 className="text-2xl font-bold text-navy-950 font-serif">
                Travel Packages for {destination.name}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* 5. LINKED HOTELS */}
      {hotels?.length > 0 && (
        <section id="hotels-section" className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block mb-1">
                Luxury Stays
              </span>
              <h2 className="text-2xl font-bold text-navy-950 font-serif">
                Hotels & Resorts in {destination.name}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        </section>
      )}

      {/* 6. LINKED ACTIVITIES */}
      {activities?.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                Experiences
              </span>
              <h2 className="text-2xl font-bold text-navy-950 font-serif">
                Things to Do in {destination.name}
              </h2>
            </div>
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
      )}

      {/* 7. REVIEWS & RATINGS */}
      <section className="space-y-6 pt-6 border-t border-charcoal-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-widest block mb-1">
              Community Feedback
            </span>
            <h2 className="text-2xl font-bold text-navy-950 font-serif">
              Traveler Reviews ({reviews?.length || 0})
            </h2>
          </div>
          <button
            onClick={() => setReviewModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-navy-900 text-white font-bold text-xs shadow-soft hover:bg-navy-800 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4 text-sunset-400" />
            <span>Write a Review</span>
          </button>
        </div>

        {reviews?.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-100 shadow-soft">
            <p className="text-xs text-charcoal-500">
              No reviews yet for {destination.name}. Be the first traveler to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        rev.user?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.user?.name || 'Traveler')}&background=0B192C&color=fff`
                      }
                      alt={rev.user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-navy-950">{rev.user?.name || 'Verified Traveler'}</h4>
                      <span className="text-[10px] text-charcoal-400">{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-sunset-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        targetType="destination"
        targetId={destination._id}
        targetTitle={destination.name}
        onReviewSubmitted={() => fetchDestinationData()}
      />

      {/* Quick Booking Modal */}
      <BookingModal
        isOpen={!!bookingModalItem}
        onClose={() => setBookingModalItem(null)}
        item={bookingModalItem}
        type={bookingModalType}
      />
    </div>
  );
}
