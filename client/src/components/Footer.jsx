import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Send, Check, ShieldCheck, Globe, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-navy-950 text-white pt-16 pb-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-navy-800/80 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-sunset-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Stays</h4>
              <p className="text-xs text-charcoal-400">100% curated properties</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-ocean-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Global Reach</h4>
              <p className="text-xs text-charcoal-400">India & International trips</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-sunset-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Best Price Promise</h4>
              <p className="text-xs text-charcoal-400">Transparent & all-inclusive</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Smart Trip Planner</h4>
              <p className="text-xs text-charcoal-400">Customized day-by-day plans</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-white shadow-soft">
                <Compass className="w-6 h-6 text-sunset-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white font-serif">
                  VAYORA
                </span>
                <span className="text-[10px] tracking-widest text-ocean-300 font-medium uppercase -mt-1">
                  Travel beyond the ordinary
                </span>
              </div>
            </Link>
            <p className="text-sm text-charcoal-400 leading-relaxed max-w-sm">
              Discover curated luxury journeys, premium boutique resorts, and bespoke itineraries crafted for travelers seeking authentic wonders.
            </p>
            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-300 mb-2">
                Join the Voyage Insider Newsletter
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-950/40 border border-emerald-800 px-3 py-2 rounded-xl">
                  <Check className="w-4 h-4" /> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-navy-900 border border-navy-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-charcoal-500 focus:outline-none focus:border-sunset-500"
                  />
                  <button
                    type="submit"
                    className="bg-sunset-500 hover:bg-sunset-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center shadow-soft"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-charcoal-400">
              <li>
                <Link to="/destinations" className="hover:text-white transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="hover:text-white transition-colors">
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="hover:text-white transition-colors">
                  Luxury Hotels & Resorts
                </Link>
              </li>
              <li>
                <Link to="/activities" className="hover:text-white transition-colors">
                  Adventure & Experiences
                </Link>
              </li>
              <li>
                <Link to="/trip-planner" className="hover:text-white transition-colors">
                  Custom Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Top Destinations */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Destinations
            </h3>
            <ul className="space-y-2.5 text-sm text-charcoal-400">
              <li>
                <Link to="/destinations?search=Kashmir" className="hover:text-white transition-colors">
                  Kashmir Valley
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Goa" className="hover:text-white transition-colors">
                  Goa Beaches
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Kerala" className="hover:text-white transition-colors">
                  Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Dubai" className="hover:text-white transition-colors">
                  Dubai Skyline
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Bali" className="hover:text-white transition-colors">
                  Bali Island
                </Link>
              </li>
              <li>
                <Link to="/destinations?search=Switzerland" className="hover:text-white transition-colors">
                  Swiss Alps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Trust */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-charcoal-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About VAYORA
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQs & Knowledge Base
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Travel Stories & Guides
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-white transition-colors">
                  Partner / Vendor Portal
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Academic Project Info */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>
            © {new Date().getFullYear()} VAYORA Travel Technologies. All rights reserved.
          </p>
          <p className="text-charcoal-400 font-medium">
            Academic Capstone: <span className="text-ocean-400">Travel & Tourism Management System</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
