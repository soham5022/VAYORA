import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-charcoal-500 hover:text-navy-950 uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Terms of Service</h1>
          <p className="text-xs text-charcoal-400">Last updated: March 1, 2026 • Effective immediately</p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-charcoal-100 shadow-soft space-y-8 text-sm text-charcoal-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or utilizing the VAYORA platform (operated by VAYORA Travel Technologies Pvt Ltd), including our web application, APIs, and concierge services, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">2. Platform Role & Bookings</h2>
            <p>
              VAYORA operates as a curated travel management platform connecting guests with verified accommodation providers, licensed tour guides, and luxury experience operators. When you book an itinerary or hotel room through VAYORA:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-charcoal-600">
              <li>You confirm all guest details, government identification, and contact information provided are accurate.</li>
              <li>Your reservation is confirmed upon receipt of a valid booking ID and full or deposit payment authorization.</li>
              <li>Pricing is displayed transparently in INR (₹) inclusive of statutory GST (5%) and transparent platform service fees.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">3. User Conduct & Prohibited Activities</h2>
            <p>
              Users are prohibited from reverse-engineering the platform, scraping catalog content or pricing, generating fraudulent bookings, utilizing automated coupon exploit bots, or impersonating other individuals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">4. Intellectual Property</h2>
            <p>
              All trademarks, imagery, brand graphics, smart itinerary generator algorithms, and editorial guides remain the exclusive property of VAYORA Travel Technologies Pvt Ltd and its licensors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">5. Limitation of Liability</h2>
            <p>
              While VAYORA enforces strict safety and quality audits across all partner resorts and guided activities, VAYORA shall not be liable for force majeure events, natural weather disruptions, civil flight cancellations, or personal health emergencies. Comprehensive travel insurance is strongly recommended.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-navy-950">6. Governing Law & Jurisdiction</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising out of your usage of the platform shall fall under the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
