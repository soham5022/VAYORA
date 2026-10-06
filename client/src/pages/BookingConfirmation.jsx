import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Printer,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../api/client';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B35', '#0EA5E9', '#0B192C', '#10B981'],
    });

    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/${id}`);
        setBooking(res.data.data);
      } catch (err) {
        console.error('Failed to load booking confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-950">Booking record not found</h2>
        <Link to="/dashboard" className="text-sm font-bold text-ocean-600 underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 print:p-0 print:m-0">
      {/* Confirmed Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 rounded-3xl shadow-elevated text-center space-y-3 print:bg-none print:text-black print:border">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-white">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
          Booking Confirmed 🎉
        </h1>
        <p className="text-sm text-emerald-50 max-w-md mx-auto">
          Thank you for choosing VAYORA. Your reservation has been finalized and recorded in the database.
        </p>
      </div>

      {/* Printable Invoice & Confirmation Card */}
      <div className="bg-white rounded-3xl border border-charcoal-200/80 shadow-soft p-6 sm:p-10 space-y-8 print:shadow-none print:border-none">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-950 text-sunset-500 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-navy-950">VAYORA</span>
              <span className="text-[10px] text-charcoal-400 block -mt-1 tracking-widest uppercase">
                Official Booking Receipt
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-charcoal-400 uppercase tracking-wider block">
              Reference Code
            </span>
            <span className="text-lg font-mono font-extrabold text-navy-950">
              {booking.bookingId}
            </span>
          </div>
        </div>

        {/* Item Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100">
          {booking.itemImage && (
            <img
              src={booking.itemImage}
              alt=""
              className="w-20 h-20 rounded-xl object-cover"
            />
          )}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-ocean-700 uppercase tracking-wider">
              {booking.type.toUpperCase()} • {booking.destination}
            </span>
            <h3 className="text-lg font-bold text-navy-950">{booking.itemName}</h3>
            {booking.roomType && (
              <p className="text-xs text-charcoal-600 font-medium">Room Tier: {booking.roomType}</p>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-charcoal-400 font-bold uppercase tracking-wider block">
              Travel Date
            </span>
            <p className="font-bold text-navy-950">
              {booking.type === 'hotel'
                ? `${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}`
                : formatDate(booking.travelDate)}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-charcoal-400 font-bold uppercase tracking-wider block">
              Passengers / Guests
            </span>
            <p className="font-bold text-navy-950">
              {booking.travelers || booking.guests || 1} Person(s)
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-charcoal-400 font-bold uppercase tracking-wider block">
              Primary Guest
            </span>
            <p className="font-bold text-navy-950">{booking.contactInfo?.name}</p>
          </div>

          <div className="space-y-1">
            <span className="text-charcoal-400 font-bold uppercase tracking-wider block">
              Payment Status
            </span>
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-charcoal-100 pt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
            Payment Breakdown
          </h4>
          <div className="flex justify-between text-xs text-charcoal-600">
            <span>Method: {booking.paymentMethod}</span>
            <span className="font-mono text-charcoal-500">{booking.paymentId}</span>
          </div>
          <div className="flex justify-between text-xs text-charcoal-600">
            <span>Taxes & GST (Included)</span>
            <span className="text-emerald-600 font-semibold">Included</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-navy-950 pt-2 border-t border-charcoal-100">
            <span>Total Paid (Simulated)</span>
            <span className="text-xl">{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>

        {/* Action Buttons (Hidden during printing) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-charcoal-100 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 font-bold text-xs flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print Receipt</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/dashboard/bookings"
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft text-center"
            >
              My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 font-bold text-xs text-center"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
