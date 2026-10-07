import React from 'react';
import { RefreshCw, Clock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  const tiers = [
    {
      timeframe: '> 48 Hours Before Departure',
      refund: '100% Full Refund',
      badge: 'Zero Penalty',
      color: 'emerald',
      desc: 'Cancel with complete peace of mind. All hotel reservation fees and package payments are 100% refunded to your original payment method.',
    },
    {
      timeframe: '24 to 48 Hours Before Departure',
      refund: '50% Partial Refund',
      badge: '50% Retained',
      color: 'amber',
      desc: 'Due to confirmed resort locks and private transportation bookings, 50% of the total booking value is refunded, while 50% covers non-recoverable supplier fees.',
    },
    {
      timeframe: '< 24 Hours / No-Show',
      refund: 'Non-Refundable',
      badge: 'Supplier Commitment',
      color: 'rose',
      desc: 'Cancellations made under 24 hours from departure cannot be refunded as hotel villas, flights, and private guides are fully allocated.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-navy-950 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset-50 text-sunset-700 text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Fair & Transparent Policy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Cancellation & Refund Policy</h1>
          <p className="text-charcoal-600 text-sm">
            We understand plans change. Our transparent cancellation timeline guarantees clear, hassle-free processing without hidden deductions.
          </p>
        </div>

        {/* Visual Timeline Cards */}
        <div className="space-y-4">
          {tiers.map((t, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-ocean-600" />
                  <span className="text-base font-bold text-navy-950 font-serif">{t.timeframe}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  t.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  t.color === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {t.refund}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Processing Details */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-charcoal-100 shadow-soft space-y-6 text-sm text-charcoal-700 leading-relaxed">
          <h2 className="text-2xl font-serif font-bold text-navy-950">How Refunds Are Processed</h2>
          <ul className="list-disc pl-5 space-y-2 text-charcoal-600 text-xs sm:text-sm">
            <li><strong>Initiation:</strong> You can initiate a cancellation instantly from your <Link to="/dashboard/bookings" className="text-ocean-600 underline font-bold">User Dashboard</Link> under "My Bookings".</li>
            <li><strong>Method:</strong> Refunds are credited directly back to the original UPI ID, Credit/Debit card, or Net Banking account used during booking.</li>
            <li><strong>Timeline:</strong> Automated refunds are dispatched within 24 hours of cancellation and typically reflect on bank statements within 3 to 5 business days.</li>
            <li><strong>Tax & GST Treatment:</strong> In accordance with Indian tax rules, GST charged is adjusted and credited proportionally.</li>
          </ul>

          <div className="p-4 rounded-2xl bg-ocean-50/70 border border-ocean-200 text-xs text-ocean-900 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-ocean-600 shrink-0 mt-0.5" />
            <div>
              <strong>Instant Cancellation Guarantee:</strong> No paperwork or call queues required. One-click cancellation is integrated into every active booking voucher in your dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
