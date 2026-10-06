import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Printer,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Users,
  CreditCard,
} from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' | 'confirmed' | 'cancelled'
  const [cancellingId, setCancellingId] = useState(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      setBookings(res.data.data || []);
    } catch (err) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A demo refund will be processed.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data?.success) {
        showToast('Booking cancelled successfully and refunded.', 'success');
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId
              ? { ...b, bookingStatus: 'Cancelled', paymentStatus: 'Refunded' }
              : b
          )
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (tab === 'confirmed') return b.bookingStatus === 'Confirmed';
    if (tab === 'cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            My Bookings
          </h1>
          <p className="text-xs text-charcoal-500">
            Track, manage, and download confirmation invoices for your trips
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-charcoal-50 p-1 rounded-2xl border border-charcoal-100 text-xs font-bold">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              tab === 'all' ? 'bg-navy-900 text-white shadow-xs' : 'text-charcoal-600 hover:text-navy-950'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setTab('confirmed')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              tab === 'confirmed' ? 'bg-navy-900 text-white shadow-xs' : 'text-charcoal-600 hover:text-navy-950'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setTab('cancelled')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              tab === 'cancelled' ? 'bg-navy-900 text-white shadow-xs' : 'text-charcoal-600 hover:text-navy-950'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-charcoal-400">Loading your reservations...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Calendar className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No bookings in this tab</h3>
          <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
            Ready to embark on an extraordinary journey? Explore packages or book a luxury stay.
          </p>
          <div className="pt-2">
            <Link
              to="/destinations"
              className="inline-block px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs shadow-soft"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="p-5 rounded-2xl border border-charcoal-100 hover:border-charcoal-200 bg-white transition-all space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-50 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-ocean-700 bg-ocean-50 px-2.5 py-1 rounded-lg">
                    {b.bookingId}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                    Booked on {formatDate(b.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ${
                      b.bookingStatus === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      b.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-charcoal-100 text-charcoal-600'
                    }`}
                  >
                    Payment: {b.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {b.itemImage ? (
                    <img src={b.itemImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                      {b.type.toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-ocean-700 uppercase tracking-wider">
                      {b.type} • {b.destination}
                    </span>
                    <h3 className="text-base font-bold text-navy-950">{b.itemName}</h3>
                    <p className="text-xs text-charcoal-500">
                      Dates:{' '}
                      <strong className="text-navy-900">
                        {b.type === 'hotel'
                          ? `${formatDate(b.checkIn)} to ${formatDate(b.checkOut)}`
                          : formatDate(b.travelDate)}
                      </strong>{' '}
                      • {b.travelers || b.guests} traveler(s)
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-charcoal-50">
                  <span className="text-xs text-charcoal-400 block">Total Amount</span>
                  <span className="text-xl font-extrabold text-navy-950">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-charcoal-50 text-xs">
                <Link
                  to={`/booking/confirmation/${b._id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-ocean-700 hover:text-ocean-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable Confirmation</span>
                </Link>

                {b.bookingStatus === 'Confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(b._id)}
                    disabled={cancellingId === b._id}
                    className="inline-flex items-center gap-1 font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{cancellingId === b._id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
