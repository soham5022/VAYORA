import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  MapPin,
  Package,
  Hotel,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import api from '../../api/client';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-charcoal-400">Loading platform statistics...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-navy-950 to-navy-900 text-white p-5 rounded-3xl shadow-premium space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ocean-300 uppercase tracking-wider">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold">{formatCurrency(stats.totalRevenue)}</p>
          <span className="text-[10px] text-charcoal-300 block">Across confirmed bookings</span>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-400 uppercase tracking-wider">
            <span>Total Bookings</span>
            <Calendar className="w-4 h-4 text-ocean-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{stats.totalBookings}</p>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="text-emerald-600">{stats.confirmedBookings} Confirmed</span>
            <span>•</span>
            <span className="text-rose-600">{stats.cancelledBookings} Cancelled</span>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-400 uppercase tracking-wider">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-sunset-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">{stats.totalUsers}</p>
          <span className="text-[10px] text-charcoal-400 block">Active platform accounts</span>
        </div>

        {/* Total Catalog Items */}
        <div className="bg-white p-5 rounded-3xl border border-charcoal-100 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal-400 uppercase tracking-wider">
            <span>Catalog Items</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-950">
            {stats.totalDestinations + stats.totalPackages + stats.totalHotels}
          </p>
          <span className="text-[10px] text-charcoal-400 block">
            {stats.totalDestinations} Dest • {stats.totalPackages} Pkg • {stats.totalHotels} Hotels
          </span>
        </div>
      </div>

      {/* Catalog Breakdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/destinations"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:border-ocean-300 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-charcoal-400 uppercase">Destinations</span>
            <p className="text-xl font-extrabold text-navy-950">{stats.totalDestinations} Active</p>
          </div>
          <MapPin className="w-6 h-6 text-ocean-600" />
        </Link>

        <Link
          to="/admin/packages"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:border-sunset-300 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-charcoal-400 uppercase">Travel Packages</span>
            <p className="text-xl font-extrabold text-navy-950">{stats.totalPackages} Published</p>
          </div>
          <Package className="w-6 h-6 text-sunset-500" />
        </Link>

        <Link
          to="/admin/hotels"
          className="p-5 rounded-2xl bg-white border border-charcoal-100 shadow-soft hover:border-indigo-300 transition-colors flex items-center justify-between"
        >
          <div>
            <span className="text-[11px] font-bold text-charcoal-400 uppercase">Hotels & Resorts</span>
            <p className="text-xl font-extrabold text-navy-950">{stats.totalHotels} Listed</p>
          </div>
          <Hotel className="w-6 h-6 text-indigo-600" />
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy-950 font-serif">Recent System Bookings</h2>
            <p className="text-xs text-charcoal-400">Live feed of transactions stored in MongoDB</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
          >
            <span>All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Destination / Item</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50 font-medium">
              {stats.recentBookings?.map((b) => (
                <tr key={b._id} className="hover:bg-charcoal-50/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-navy-950">{b.bookingId}</td>
                  <td className="py-3 text-navy-900">{b.user?.name || b.contactInfo?.name || 'Customer'}</td>
                  <td className="py-3 text-charcoal-600 max-w-[180px] truncate">{b.itemName}</td>
                  <td className="py-3 text-charcoal-500">{formatDate(b.createdAt)}</td>
                  <td className="py-3 font-bold text-navy-950">{formatCurrency(b.totalAmount)}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        b.bookingStatus === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
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
  );
}
