import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  Loader2,
  Building,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calculateNights } from '../utils/formatters';

export default function BookingModal({ isOpen, onClose, item, type = 'package' }) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Booking fields
  const [travelDate, setTravelDate] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Payment method demo
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    expiry: '12/28',
    cvv: '•••',
  });
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');

  // Flow states
  const [step, setStep] = useState(1); // 1: details, 2: demo payment, 3: processing
  const [loading, setLoading] = useState(false);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setContactInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+91 98765 43210',
      });
    }

    // Default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const dayAfter = new Date(nextWeek);
    dayAfter.setDate(nextWeek.getDate() + 3);

    const fmt = (d) => d.toISOString().split('T')[0];
    setTravelDate(fmt(nextWeek));
    setCheckIn(fmt(nextWeek));
    setCheckOut(fmt(dayAfter));

    if (type === 'hotel' && item?.rooms?.length > 0) {
      setSelectedRoom(item.rooms[0].roomType);
    }
  }, [user, item, type]);

  if (!isOpen || !item) return null;

  // Calculate pricing
  let unitPrice = 0;
  let totalAmount = 0;
  let calculationNote = '';

  if (type === 'package') {
    unitPrice = item.price || 0;
    totalAmount = unitPrice * Number(travelers);
    calculationNote = `${formatCurrency(unitPrice)} × ${travelers} traveler${travelers > 1 ? 's' : ''}`;
  } else if (type === 'hotel') {
    const nights = calculateNights(checkIn, checkOut);
    const roomObj = item.rooms?.find((r) => r.roomType === selectedRoom) || item.rooms?.[0];
    unitPrice = roomObj ? roomObj.pricePerNight : item.pricePerNight || 0;
    totalAmount = unitPrice * nights;
    calculationNote = `${formatCurrency(unitPrice)}/night × ${nights} night${nights > 1 ? 's' : ''}`;
  } else if (type === 'activity') {
    unitPrice = item.price || 0;
    totalAmount = unitPrice * Number(travelers);
    calculationNote = `${formatCurrency(unitPrice)} × ${travelers} person${travelers > 1 ? 's' : ''}`;
  }

  // Taxes and platform fee demo (0% for student transparency)
  const finalPayable = totalAmount;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to proceed with booking', 'info');
      navigate('/login');
      return;
    }
    if (!contactInfo.name || !contactInfo.email) {
      showToast('Please enter your traveler contact details', 'error');
      return;
    }
    setStep(2);
  };

  const handleConfirmAndPay = async () => {
    try {
      setLoading(true);
      setStep(3); // show simulated animation

      // Simulate banking gateway delay for authentic UX
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const payload = {
        type,
        itemId: item._id,
        travelDate: type === 'hotel' ? checkIn : travelDate,
        checkIn: type === 'hotel' ? checkIn : undefined,
        checkOut: type === 'hotel' ? checkOut : undefined,
        travelers: Number(travelers),
        guests: Number(travelers),
        roomType: type === 'hotel' ? selectedRoom : undefined,
        contactInfo,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (Demo Simulator)'
            : paymentMethod === 'upi'
            ? 'UPI (Demo Simulator)'
            : 'Net Banking (Demo Simulator)',
      };

      const res = await api.post('/bookings', payload);

      if (res.data?.success) {
        showToast('Booking successfully confirmed! 🎉', 'success');
        onClose();
        navigate(`/booking/confirmation/${res.data.data._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Payment processing failed. Please try again.', 'error');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-elevated border border-charcoal-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sunset-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-ocean-300 font-semibold block">
                {step === 1 ? 'Step 1 of 2: Reservation Details' : 'Step 2 of 2: Demo Payment'}
              </span>
              <h2 className="text-lg font-bold text-white truncate max-w-md">
                {item.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-charcoal-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 3: Payment Processing Animation */}
        {step === 3 && (
          <div className="py-20 px-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-ocean-100 border-t-sunset-500 animate-spin flex items-center justify-center"></div>
              <ShieldCheck className="w-8 h-8 text-sunset-500 absolute inset-0 m-auto" />
            </div>
            <h3 className="text-xl font-bold text-navy-950">Securing Your Reservation...</h3>
            <p className="text-sm text-charcoal-500 max-w-xs">
              Simulating payment verification and persisting your booking in the MongoDB database.
            </p>
          </div>
        )}

        {/* Step 1: Details & Dates */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="p-6 sm:p-8 space-y-6">
            {/* Item summary banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100">
              <img
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80'}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-ocean-700 uppercase tracking-wider block">
                  {type.toUpperCase()} • {item.destinationName || item.location}
                </span>
                <h4 className="text-sm font-bold text-navy-950 truncate">{item.name}</h4>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Base Rate: <span className="font-semibold text-navy-900">{formatCurrency(unitPrice)}</span>
                </p>
              </div>
            </div>

            {/* Date selection */}
            {type === 'hotel' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wider">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:border-ocean-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wider">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:border-ocean-600"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wider">
                  Travel Date
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:border-ocean-600"
                />
              </div>
            )}

            {/* Hotel Room Selection */}
            {type === 'hotel' && item.rooms?.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wider">
                  Select Room Tier
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-navy-900 focus:outline-none focus:border-ocean-600"
                >
                  {item.rooms.map((room) => (
                    <option key={room.roomType} value={room.roomType}>
                      {room.roomType} — {formatCurrency(room.pricePerNight)} / night ({room.bedType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Travelers Count */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5 uppercase tracking-wider">
                {type === 'hotel' ? 'Number of Guests' : 'Number of Travelers'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 bg-white border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-navy-900 focus:outline-none focus:border-ocean-600"
                />
                <span className="text-xs text-charcoal-400">
                  {travelers > 1 ? `${travelers} passengers` : '1 passenger'}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-t border-charcoal-100 pt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-3">
                Primary Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-900 focus:outline-none focus:border-ocean-600"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-900 focus:outline-none focus:border-ocean-600"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-900 focus:outline-none focus:border-ocean-600"
                  />
                </div>
              </div>
            </div>

            {/* Price calculation bar & CTA */}
            <div className="pt-4 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-charcoal-400 block">{calculationNote}</span>
                <span className="text-2xl font-extrabold text-navy-950">
                  {formatCurrency(finalPayable)}
                </span>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Demo Payment</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Safe Demo Payment Gateway */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Academic Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-950 mb-0.5">
                  Academic Project Demo Simulator
                </strong>
                This system runs in safe educational mode. No actual money or credit card charges will occur. A real booking confirmation and payment record will be securely generated in the MongoDB database.
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-2 uppercase tracking-wider">
                Select Test Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', name: 'UPI / QR', icon: Sparkles },
                  { id: 'netbanking', name: 'Net Banking', icon: Building },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPaymentMethod(mode.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        paymentMethod === mode.id
                          ? 'border-ocean-600 bg-ocean-50/60 text-navy-950 shadow-xs'
                          : 'border-charcoal-200 hover:border-charcoal-300 text-charcoal-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${paymentMethod === mode.id ? 'text-ocean-600' : 'text-charcoal-400'}`} />
                      <span className="text-xs font-bold">{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Method inputs */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                    Demo Card Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={cardDetails.number}
                    className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm font-mono text-navy-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.expiry}
                      className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm font-mono text-navy-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.cvv}
                      className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm font-mono text-navy-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 space-y-2">
                <label className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                  Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-navy-900 font-medium"
                />
                <p className="text-[11px] text-charcoal-400">Supported: GPay, PhonePe, Paytm, BHIM</p>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 space-y-2">
                <label className="text-[11px] font-bold text-charcoal-500 uppercase tracking-wider block mb-1">
                  Select Demo Bank
                </label>
                <select className="w-full bg-white border border-charcoal-200 rounded-xl px-3 py-2 text-sm text-navy-900 font-medium">
                  <option>HDFC Bank (Instant Verification)</option>
                  <option>State Bank of India</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}

            {/* Price confirmation box */}
            <div className="p-4 rounded-2xl bg-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-ocean-300 block">Total Payable (Simulated)</span>
                <span className="text-2xl font-black">{formatCurrency(finalPayable)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <Lock className="w-3.5 h-3.5" />
                256-bit Encrypted
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 font-bold text-sm hover:bg-charcoal-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-sunset-500 hover:bg-sunset-600 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
