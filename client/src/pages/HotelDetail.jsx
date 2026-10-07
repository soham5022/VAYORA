import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Check,
  Calendar,
  Users,
  Heart,
  Share2,
  ShieldCheck,
  Building,
  Wifi,
  Waves,
  Coffee,
  MessageSquarePlus,
  Bed,
} from 'lucide-react';
import api from '../api/client';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate, calculateNights } from '../utils/formatters';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import { fallbackHotels } from '../data/fallbackData';

export default function HotelDetail() {
  const { id } = useParams();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const getMatchedHotel = (targetId) => {
    return (
      fallbackHotels.find(
        (h) =>
          h._id === targetId ||
          String(h.id) === targetId ||
          h.name?.toLowerCase().includes(String(targetId).toLowerCase())
      ) || fallbackHotels[0]
    );
  };

  const initialHotel = getMatchedHotel(id);
  const defaultReviews = [
    {
      _id: 'rev_hotel_1',
      rating: 5,
      title: 'Supreme luxury and hospitality',
      comment: `Our stay at ${initialHotel.name} exceeded every standard. Outstanding dining, immaculately maintained suites, and attentive concierge service!`,
      user: { name: 'Aarav Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
      createdAt: '2026-03-20T11:00:00Z',
    },
    {
      _id: 'rev_hotel_2',
      rating: 5,
      title: 'Breathtaking property and peaceful vibe',
      comment: 'The swimming pool, view from the balcony, and morning breakfast were incredible. Highly recommended!',
      user: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      createdAt: '2026-02-14T09:30:00Z',
    },
  ];

  const [hotelData, setHotelData] = useState(() => ({
    hotel: initialHotel,
    reviews: defaultReviews,
  }));
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reservation inputs
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(() => initialHotel.rooms?.[0] || null);
  const [guests, setGuests] = useState(2);

  // Modals
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const fetchHotel = async () => {
    try {
      const res = await api.get(`/hotels/${id}`);
      if (res.data?.data?.hotel) {
        setHotelData({
          hotel: res.data.data.hotel,
          reviews: res.data.data.reviews?.length > 0 ? res.data.data.reviews : defaultReviews,
        });
        if (res.data.data.hotel.rooms?.length > 0) {
          setSelectedRoom(res.data.data.hotel.rooms[0]);
        }
      }
    } catch (err) {
      console.warn('Hotel API fallback notice:', err.message);
    }
  };

  useEffect(() => {
    const matched = getMatchedHotel(id);
    if (matched) {
      setHotelData((prev) => ({
        hotel: matched,
        reviews: prev?.reviews?.length > 0 ? prev.reviews : defaultReviews,
      }));
      if (matched.rooms?.length > 0) {
        setSelectedRoom(matched.rooms[0]);
      }
    }
    fetchHotel();

    // Default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 5);
    const dayAfter = new Date(nextWeek);
    dayAfter.setDate(nextWeek.getDate() + 3);

    const fmt = (d) => d.toISOString().split('T')[0];
    setCheckIn(fmt(nextWeek));
    setCheckOut(fmt(dayAfter));

    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-semibold text-charcoal-500">Loading hotel details...</p>
      </div>
    );
  }

  if (!hotelData || !hotelData.hotel) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Hotel not found</h2>
        <Link to="/hotels" className="text-sm font-bold text-ocean-600 underline">
          Back to all hotels
        </Link>
      </div>
    );
  }

  const { hotel, reviews } = hotelData;
  const isFav = isInWishlist(hotel._id);

  const nights = calculateNights(checkIn, checkOut);
  const ratePerNight = selectedRoom?.pricePerNight || hotel.pricePerNight;
  const estimatedStayTotal = ratePerNight * nights;

  const handleWishlistToggle = () => {
    toggleWishlist({
      itemType: 'hotel',
      itemId: hotel._id,
      title: hotel.name,
      image: hotel.images?.[0] || '',
      location: hotel.location || hotel.destinationName,
      price: hotel.pricePerNight,
      rating: hotel.rating,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-950 font-serif">
            {hotel.name}
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
            className="px-6 py-3 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft hover:shadow-premium transition-all"
          >
            Reserve a Room
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl overflow-hidden shadow-premium">
        <div className="lg:col-span-2 aspect-[16/10] bg-charcoal-100 overflow-hidden">
          <img
            src={hotel.images?.[selectedImage] || hotel.images?.[0]}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          {hotel.images?.slice(0, 3).map((img, idx) => (
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
            <h2 className="text-xl font-bold text-navy-950">Property Overview</h2>
            <p className="text-charcoal-600 text-sm leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <h2 className="text-xl font-bold text-navy-950">Resort Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-charcoal-50 border border-charcoal-100 text-xs font-semibold text-charcoal-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Rooms Selection */}
          {hotel.rooms?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy-950">Select Room Option</h2>
                <p className="text-xs text-charcoal-400">All room rates include daily buffet breakfast</p>
              </div>

              <div className="space-y-4">
                {hotel.rooms.map((room, idx) => {
                  const isSelected = selectedRoom?.roomType === room.roomType;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-ocean-600 bg-ocean-50/40 shadow-xs'
                          : 'border-charcoal-100 hover:border-charcoal-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-ocean-600" />
                          <h3 className="text-base font-bold text-navy-950">{room.roomType}</h3>
                        </div>
                        <p className="text-xs text-charcoal-500">
                          {room.bedType} • Sleeps up to {room.capacity} guests
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {room.amenities?.map((a, i) => (
                            <span key={i} className="text-[10px] font-medium bg-charcoal-100/70 text-charcoal-600 px-2 py-0.5 rounded-md">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:pl-6 border-charcoal-100 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                        <div>
                          <span className="text-lg font-extrabold text-navy-950">
                            {formatCurrency(room.pricePerNight)}
                          </span>
                          <span className="text-[11px] text-charcoal-400 block">/ night</span>
                        </div>
                        <button
                          type="button"
                          className={`mt-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-ocean-600 text-white'
                              : 'bg-charcoal-100 text-charcoal-700'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select Room'}
                        </button>
                      </div>
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
                <h2 className="text-xl font-bold text-navy-950">Guest Reviews</h2>
                <p className="text-xs text-charcoal-400">{reviews?.length || 0} reviews for this property</p>
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
              <p className="text-xs text-charcoal-400 italic">No reviews yet for this hotel.</p>
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
                        <span className="text-xs font-bold text-navy-950">{rev.user?.name || 'Verified Guest'}</span>
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

        {/* Right Sticky Reservation Widget */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-100 shadow-premium space-y-5">
            <div>
              <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                {selectedRoom?.roomType || 'Room Rate'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-navy-950">
                  {formatCurrency(ratePerNight)}
                </span>
                <span className="text-xs text-charcoal-400">/ night</span>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
                <label className="text-[10px] font-bold uppercase text-charcoal-400 block">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-navy-950 focus:outline-none"
                />
              </div>
              <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
                <label className="text-[10px] font-bold uppercase text-charcoal-400 block">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-navy-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="p-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200">
              <label className="text-[10px] font-bold uppercase text-charcoal-400 block">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-transparent text-xs font-bold text-navy-950 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>{g} {g > 1 ? 'Guests' : 'Guest'}</option>
                ))}
              </select>
            </div>

            {/* Total calculation */}
            <div className="pt-3 border-t border-charcoal-100 space-y-1.5 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>{formatCurrency(ratePerNight)} × {nights} nights</span>
                <span className="font-bold text-navy-950">{formatCurrency(estimatedStayTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Hotel Fees</span>
                <span className="text-emerald-600 font-medium">Included</span>
              </div>
              <div className="pt-2 border-t border-charcoal-100 flex justify-between text-sm font-extrabold text-navy-950">
                <span>Total Stay Cost</span>
                <span className="text-lg">{formatCurrency(estimatedStayTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all"
            >
              Reserve Now
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Instant booking confirmation • Safe demo payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        item={hotel}
        type="hotel"
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        targetType="hotel"
        targetId={hotel._id}
        targetTitle={hotel.name}
        onReviewSubmitted={() => fetchHotel()}
      />
    </div>
  );
}
