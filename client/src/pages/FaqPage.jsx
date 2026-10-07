import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';
import api from '../api/client';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = ['All', 'Bookings', 'Cancellations & Refunds', 'Payments', 'Trip Planner', 'General', 'Safety & Trust'];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/faqs', {
          params: { category: category !== 'All' ? category : undefined, search: search || undefined },
        });
        if (res.data?.data) {
          setFaqs(res.data.data);
        }
      } catch (err) {
        console.warn('FAQ load notice:', err.message);
      }
    };
    fetchFaqs();
  }, [category, search]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Frequently Asked Questions</h1>
          <p className="text-charcoal-600 text-sm sm:text-base">
            Find immediate answers regarding booking procedures, flexible cancellation policies, secure payment processing, and itinerary planning.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. refund, payments, itinerary)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-charcoal-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'bg-white border border-charcoal-200 text-charcoal-600 hover:border-charcoal-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-charcoal-200 text-charcoal-500">
              No matching questions found for "{search}". Try searching another keyword or contact concierge.
            </div>
          ) : (
            faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq._id || idx}
                  className="bg-white rounded-2xl border border-charcoal-100 shadow-soft overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="text-base font-bold text-navy-950 font-serif">{faq.question}</span>
                    <span className="text-ocean-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-charcoal-600 leading-relaxed border-t border-charcoal-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need More Assistance Banner */}
        <div className="bg-gradient-to-r from-ocean-50 to-blue-50 border border-ocean-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-navy-950 font-serif">Still have questions?</h3>
            <p className="text-xs text-charcoal-600">Our private concierge desk is available 24 hours a day to tailor your arrangements.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-5 py-3 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
