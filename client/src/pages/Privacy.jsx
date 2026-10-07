import React from 'react';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-navy-950 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Privacy Policy</h1>
          <p className="text-xs text-charcoal-400">Last updated: March 1, 2026 • Compliant with Indian DPDP Act & Global Standards</p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-charcoal-100 shadow-soft space-y-8 text-sm text-charcoal-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">1. Information We Collect</h2>
            <p>
              To deliver seamless travel itineraries and confirmed bookings, VAYORA collects:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li><strong>Personal Identifiers:</strong> Name, verified email address, phone number, and physical billing address.</li>
              <li><strong>Reservation Information:</strong> Travel dates, passenger counts, hotel room choices, and emergency contact details.</li>
              <li><strong>Payment Metadata:</strong> Transaction reference IDs, invoice numbers, and payment status (we do NOT store credit card numbers or CVVs).</li>
              <li><strong>Travel Preferences:</strong> Saved wishlist destinations, dietary preferences, and custom itinerary notes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">2. How We Use Your Data</h2>
            <p>
              Your information is exclusively utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li>Issue official booking vouchers, hotel room reservations, and tax invoices.</li>
              <li>Dispatch transactional emails (booking confirmations, trip reminders, password reset tokens).</li>
              <li>Provide personalized itinerary recommendations through our Smart Trip Planner.</li>
              <li>Prevent fraudulent bookings and secure our platform against unauthorized access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">3. Third-Party Disclosures</h2>
            <p>
              We never sell, rent, or monetize your personal data. Data is shared strictly on a need-to-know basis with:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li>Verified accommodation partners and tour guides solely to honor your booked arrival.</li>
              <li>PCI-DSS compliant payment processors (Razorpay) for encrypted payment settlement.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">4. Your Privacy Rights</h2>
            <p>
              You maintain the absolute right to view, update, export, or request permanent deletion of your VAYORA account and travel history by contacting privacy@vayora.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
