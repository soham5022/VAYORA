import React, { useState, useEffect } from 'react';
import { Search, Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
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

  const handleUpdateStatus = async (id, newStatus, paymentStatus) => {
    try {
      setUpdatingId(id);
      const res = await api.put(`/admin/bookings/${id}/status`, {
        bookingStatus: newStatus,
        paymentStatus,
      });
      if (res.data?.success) {
        showToast(`Booking marked as ${newStatus}`, 'success');
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? res.data.data : b))
        );
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
      b.itemName?.toLowerCase().includes(search.toLowerCase()) ||
      b.contactInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.contactInfo?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Booking Orders Management
          </h1>
          <p className="text-xs text-charcoal-500">
            View live traveler reservations, change lifecycle status, and manage refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by code, customer, or package..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Booking ID</th>
              <th className="pb-3">Customer Details</th>
              <th className="pb-3">Item / Destination</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Total Amount</th>
              <th className="pb-3">Current Status</th>
              <th className="pb-3 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((b) => (
              <tr key={b._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 font-mono font-bold text-navy-950">{b.bookingId}</td>
                <td className="py-3.5">
                  <div className="font-bold text-navy-950">{b.contactInfo?.name || b.user?.name}</div>
                  <div className="text-[10px] text-charcoal-400">{b.contactInfo?.email || b.user?.email}</div>
                  {b.contactInfo?.phone && (
                    <div className="text-[10px] text-charcoal-400">{b.contactInfo.phone}</div>
                  )}
                </td>
                <td className="py-3.5 max-w-[180px] truncate">
                  <div className="font-semibold text-navy-950">{b.itemName}</div>
                  <div className="text-[10px] text-ocean-700 font-bold uppercase">{b.type} • {b.destination}</div>
                </td>
                <td className="py-3.5 text-charcoal-600">
                  {b.type === 'hotel'
                    ? `${formatDate(b.checkIn)} – ${formatDate(b.checkOut)}`
                    : formatDate(b.travelDate)}
                </td>
                <td className="py-3.5 font-bold text-navy-950">
                  {formatCurrency(b.totalAmount)}
                  <span className="block text-[10px] text-emerald-600 font-medium">{b.paymentStatus}</span>
                </td>
                <td className="py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      b.bookingStatus === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.bookingStatus === 'Completed'
                        ? 'bg-ocean-100 text-ocean-800'
                        : b.bookingStatus === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <select
                    value={b.bookingStatus}
                    disabled={updatingId === b._id}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      const newPayment = newStatus === 'Cancelled' ? 'Refunded' : b.paymentStatus;
                      handleUpdateStatus(b._id, newStatus, newPayment);
                    }}
                    className="bg-charcoal-50 border border-charcoal-200 rounded-xl px-2.5 py-1 text-xs font-bold text-navy-950 focus:outline-none cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled (Refund)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
