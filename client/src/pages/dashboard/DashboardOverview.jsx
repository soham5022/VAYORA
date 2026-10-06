import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Compass,
  Heart,
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function DashboardOverview() {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();

  const [bookings, setBookings] = useState([]);
  const [trips, setTrips] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [bookingsRes, tripsRes, reviewsRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/trips'),
          api.get('/reviews'),
        ]);

        setBookings(bookingsRes.data.data || []);
        setTrips(tripsRes.data.data || []);
        const myReviews = (reviewsRes.data.data || []).filter(
          (r) => r.user?._id === user?._id || r.user === user?._id
        );
        setReviews(myReviews);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-7 sm:p-8 rounded-3xl shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-ocean-300 font-semibold uppercase tracking-wider block mb-1">
            Traveler Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-300 mt-1">
            Ready to plan your next extraordinary adventure?
          </p>
        </div>

        <Link
          to="/trip-planner"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sunset-500 to-sunset-600 hover:from-sunset-600 hover:to-sunset-700 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">Bookings</span>
            <Calendar className="w-4 h-4 text-ocean-600" />
          </div>
          <p className="text-2xl font-extrabold text-navy-950">{bookings.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">Custom Trips</span>
            <Compass className="w-4 h-4 text-sunset-500" />
          </div>
          <p className="text-2xl font-extrabold text-navy-950">{trips.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">Wishlist</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-navy-950">{wishlistCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-charcoal-100 shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider">Reviews</span>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-navy-950">{reviews.length}</p>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950 font-serif">Recent Bookings</h2>
            <p className="text-xs text-charcoal-400">Your upcoming and confirmed journeys</p>
          </div>
          <Link
            to="/dashboard/bookings"
            className="text-xs font-bold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-charcoal-400 space-y-2">
            <Calendar className="w-10 h-10 mx-auto text-charcoal-300" />
            <p className="text-xs font-medium">No bookings yet. Start by exploring our destinations!</p>
            <Link
              to="/destinations"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 hover:border-charcoal-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {b.itemImage ? (
                    <img src={b.itemImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                      {b.type.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-ocean-700 tracking-wider">
                      {b.type} • {b.bookingId}
                    </span>
                    <h3 className="text-sm font-bold text-navy-950">{b.itemName}</h3>
                    <p className="text-xs text-charcoal-500">
                      {b.type === 'hotel'
                        ? `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}`
                        : formatDate(b.travelDate)}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-navy-950">
                      {formatCurrency(b.totalAmount)}
                    </span>
                    <span
                      className={`inline-block ml-2 sm:ml-0 sm:block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md mt-0.5 ${
                        b.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>
                  <Link
                    to={`/booking/confirmation/${b._id}`}
                    className="text-xs font-bold text-ocean-600 hover:underline mt-2 sm:mt-1"
                  >
                    View Receipt
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/destinations"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:shadow-premium transition-all space-y-2 block"
        >
          <MapPin className="w-6 h-6 text-ocean-600" />
          <h4 className="text-sm font-bold text-navy-950">Explore Destinations</h4>
          <p className="text-xs text-charcoal-500">Discover 16+ Indian and international locales</p>
        </Link>

        <Link
          to="/trip-planner"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:shadow-premium transition-all space-y-2 block"
        >
          <Compass className="w-6 h-6 text-sunset-500" />
          <h4 className="text-sm font-bold text-navy-950">Plan Custom Trip</h4>
          <p className="text-xs text-charcoal-500">Generate intelligent day-by-day itineraries</p>
        </Link>

        <Link
          to="/dashboard/wishlist"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:shadow-premium transition-all space-y-2 block"
        >
          <Heart className="w-6 h-6 text-rose-500" />
          <h4 className="text-sm font-bold text-navy-950">View Wishlist</h4>
          <p className="text-xs text-charcoal-500">Access your saved stays, tours, and activities</p>
        </Link>
      </div>
    </div>
  );
}
