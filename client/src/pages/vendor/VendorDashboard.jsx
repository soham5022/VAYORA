import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Calendar, Star, DollarSign, Package, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api/client';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function VendorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/vendors/dashboard');
        if (res.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.warn('Vendor dashboard load notice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    activeListings: 12,
    totalBookings: 28,
    totalRevenue: 648000,
    partnerRating: 4.9,
  };

  const vendorProfile = data?.vendorProfile || {
    businessName: 'Himalayan Escapes Luxury Stays',
    businessType: 'Hotels & Resorts',
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 text-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-ocean-600 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Partner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
              {vendorProfile.businessName || 'Travel Partner Portal'}
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Category: <strong>{vendorProfile.businessType || 'Accommodations & Tours'}</strong> • Status: <span className="text-emerald-600 font-bold">Active & Verified</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('New listing submission is queued for approval in demo mode!')}
              className="px-4 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Active Inventory</span>
            <div className="text-3xl font-extrabold text-navy-950 font-serif">{stats.activeListings}</div>
            <p className="text-[10px] text-emerald-600 font-semibold">Live in VAYORA catalog</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Total Bookings</span>
            <div className="text-3xl font-extrabold text-navy-950 font-serif">{stats.totalBookings}</div>
            <p className="text-[10px] text-ocean-600 font-semibold">Confirmed traveler arrivals</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Gross Booking Value</span>
            <div className="text-3xl font-extrabold text-navy-950 font-serif">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <p className="text-[10px] text-emerald-600 font-semibold">Direct guest payouts</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-charcoal-100 shadow-soft space-y-2">
            <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider">Partner Rating</span>
            <div className="text-3xl font-extrabold text-sunset-500 font-serif flex items-center gap-1">
              <span>{stats.partnerRating}</span>
              <Star className="w-5 h-5 fill-current text-sunset-500" />
            </div>
            <p className="text-[10px] text-charcoal-400">Based on verified reviews</p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
          <h2 className="text-xl font-serif font-bold text-navy-950">Recent Partner Reservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-charcoal-500 uppercase tracking-wider border-b border-charcoal-100">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Service / Room</th>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                {(data?.recentBookings || []).slice(0, 5).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-ocean-600">{b.bookingId}</td>
                    <td className="py-3.5 px-4 font-semibold text-navy-950">{b.itemName}</td>
                    <td className="py-3.5 px-4 text-charcoal-600">{b.contactInfo?.name}</td>
                    <td className="py-3.5 px-4 text-charcoal-500">{formatDate(b.travelDate || b.checkIn)}</td>
                    <td className="py-3.5 px-4 font-bold text-navy-950">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
