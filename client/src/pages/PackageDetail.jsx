import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  Check,
  X as CloseIcon,
  Calendar,
  Users,
  ShieldCheck,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  Sparkles,
} from 'lucide-react';
import api from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';

export default function PackageDetail() {
  const { id } = useParams();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [pkgData, setPkgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Modals
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/packages/${id}`);
      setPkgData(res.data.data);
    } catch (err) {
      console.error('Failed to load package:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-charcoal-500">Loading package details...</p>
      </div>
    );
  }

  if (!pkgData || !pkgData.package) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Package not found</h2>
        <Link to="/packages" className="text-sm font-bold text-ocean-600 underline">
          Back to all packages
        </Link>
      </div>
    );
  }

  const { package: pkg, reviews } = pkgData;
  const isFav = isInWishlist(pkg._id);

  const handleWishlistToggle = () => {
    toggleWishlist({
      itemType: 'package',
      itemId: pkg._id,
      title: pkg.name,
      image: pkg.images?.[0] || '',
      location: pkg.destinationName,
      price: pkg.price,
      rating: pkg.rating,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{pkg.destinationName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-charcoal-500">
              <Clock className="w-3.5 h-3.5" />
              {pkg.duration}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 font-serif">
            {pkg.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleWishlistToggle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all ${
              isFav
                ? 'bg-rose-50 border-rose-300 text-rose-600'
                : 'bg-white border-charcoal-200 text-charcoal-700 hover:border-charcoal-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-rose-600' : ''}`} />
            <span>{isFav ? 'Saved' : 'Wishlist'}</span>
          </button>

          <button
            onClick={() => setBookingOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white font-bold text-xs shadow-soft hover:shadow-premium transition-all"
          >
            Book This Package
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-premium">
        <div className="lg:col-span-2 aspect-[16/10] bg-charcoal-100 overflow-hidden">
          <img
            src={pkg.images?.[selectedImage] || pkg.images?.[0]}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          {pkg.images?.slice(0, 3).map((img, idx) => (
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Itinerary, Inclusions, Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-navy-950">Package Overview</h2>
            <p className="text-charcoal-600 text-sm leading-relaxed whitespace-pre-line">
              {pkg.description}
            </p>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-6">
            <h2 className="text-xl font-bold text-navy-950">Inclusions & Exclusions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Included in Package
                </h3>
                <ul className="space-y-2">
                  {pkg.included?.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-charcoal-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                  <CloseIcon className="w-4 h-4 text-rose-500" />
                  Excluded from Package
                </h3>
                <ul className="space-y-2">
                  {pkg.excluded?.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-charcoal-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy-950">Day-by-Day Itinerary</h2>
                <span className="text-xs text-charcoal-400 font-medium">
                  {pkg.itinerary.length} Days Planned
                </span>
              </div>

              <div className="space-y-4">
                {pkg.itinerary.map((dayPlan) => {
                  const isOpen = activeDay === dayPlan.day;
                  return (
                    <div
                      key={dayPlan.day}
                      className="border border-charcoal-100 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setActiveDay(isOpen ? null : dayPlan.day)}
                        className="w-full p-4.5 bg-charcoal-50 hover:bg-ocean-50/50 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-navy-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            D{dayPlan.day}
                          </span>
                          <h4 className="text-sm font-bold text-navy-950">
                            {dayPlan.title}
                          </h4>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-charcoal-400" /> : <ChevronDown className="w-4 h-4 text-charcoal-400" />}
                      </button>

                      {isOpen && (
                        <div className="p-5 space-y-3 bg-white border-t border-charcoal-100 text-xs text-charcoal-600 leading-relaxed animate-in fade-in duration-150">
                          <p>{dayPlan.description}</p>
                          <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-semibold text-charcoal-500 border-t border-charcoal-50">
                            {dayPlan.meals && <span>🍽️ Meals: {dayPlan.meals}</span>}
                            {dayPlan.stay && <span>🏨 Stay: {dayPlan.stay}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Traveler Reviews</h2>
                <p className="text-xs text-charcoal-400">{reviews?.length || 0} reviews for this package</p>
              </div>
              <button
                onClick={() => setReviewOpen(true)}
                className="px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs shadow-soft flex items-center gap-1.5"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-sunset-400" />
                <span>Write Review</span>
              </button>
            </div>

            {reviews?.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic">No reviews yet. Share your experience after booking!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.user?.name || 'User')}`}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-navy-950">{rev.user?.name || 'Verified Traveler'}</span>
                      </div>
                      <div className="flex text-sunset-500">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-charcoal-600 leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Booking Card */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-100 shadow-premium space-y-6">
            <div>
              <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                Starting from
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-navy-950">
                  {formatCurrency(pkg.price)}
                </span>
                <span className="text-xs text-charcoal-400">/ person</span>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-charcoal-50 text-xs text-charcoal-700">
              <div className="flex items-center justify-between">
                <span>Duration</span>
                <strong className="text-navy-950">{pkg.duration}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Rating</span>
                <strong className="text-navy-950 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-sunset-500 text-sunset-500" />
                  {pkg.rating?.toFixed(1) || '4.9'}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Max Group Size</span>
                <strong className="text-navy-950">{pkg.maxTravelers} travelers</strong>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all"
            >
              Book Now
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-charcoal-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe demo payment • Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        item={pkg}
        type="package"
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        targetType="package"
        targetId={pkg._id}
        targetTitle={pkg.name}
        onReviewSubmitted={() => fetchPackage()}
      />
    </div>
  );
}
