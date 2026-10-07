import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Award, Heart, Users, Globe2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Curated Destinations', value: '20+' },
    { label: 'Bespoke Itineraries', value: '500+' },
    { label: 'Traveler Satisfaction', value: '99.4%' },
    { label: 'Partner Properties', value: '150+' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Uncompromising Quality',
      desc: 'Every villa, resort, and guided adventure is physically audited against 50+ hygiene, safety, and hospitality parameters.',
    },
    {
      icon: Compass,
      title: 'Intelligent Trip Planning',
      desc: 'Our proprietary planning algorithms craft balanced daily itineraries tailored to your specific travel pace and interests.',
    },
    {
      icon: Heart,
      title: 'Transparent Pricing',
      desc: 'No hidden taxes, surprise resort fees, or markups. What you see during planning is exactly what you pay at checkout.',
    },
    {
      icon: Globe2,
      title: 'Sustainable Tourism',
      desc: 'We support local guides, eco-certified chalets, and preserve the fragile cultural heritage of every valley we explore.',
    },
  ];

  const team = [
    {
      name: 'Soham Magar',
      role: 'Lead Architect & Engineering Director',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      bio: 'Full-stack system architect driving VAYORA’s scalable travel-tech infrastructure and smart itinerary engines.',
    },
    {
      name: 'Aanya Sharma',
      role: 'Head of Destination Curation',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Former luxury concierge specialized in bespoke Himalayan retreats and boutique coastal sanctuaries.',
    },
    {
      name: 'Marcus Vance',
      role: 'Chief Experience Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Over 15 years developing high-altitude mountaineering and cultural heritage routes across Asia and Europe.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-navy-950">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-navy-950 text-white py-24 sm:py-32">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-500/20 border border-ocean-400/30 text-ocean-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Capstone & Commercial Travel Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight">
            Travel beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-400 to-sunset-400">the ordinary.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-charcoal-300 font-light leading-relaxed">
            VAYORA is an integrated enterprise-grade travel and tourism management platform designed to transform how modern travelers discover, customize, book, and cherish unforgettable journeys.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-charcoal-400">
            <span>Project: <strong>Travel and Tourism Management System</strong></span>
            <span>•</span>
            <span>Architecture: <strong>Production Full-Stack REST & MERN</strong></span>
            <span>•</span>
            <span>Version: <strong>2.0 Production-Ready</strong></span>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-charcoal-100">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">{s.value}</div>
              <div className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. OUR STORY & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-ocean-600 uppercase tracking-widest block">Our Genesis</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
              Crafted for discerning travelers who value authenticity over checklists.
            </h2>
            <p className="text-charcoal-600 leading-relaxed text-sm sm:text-base">
              Founded as an advanced capstone in modern software architecture, VAYORA bridges the gap between mass-market booking aggregators and ultra-expensive bespoke travel agencies.
            </p>
            <p className="text-charcoal-600 leading-relaxed text-sm sm:text-base">
              By uniting instant availability checking, automated cost computation, multi-room inventory management, and verified traveler reviews in a single unified architecture, VAYORA delivers a world-class travel planning experience.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Direct partnerships with eco-villas and boutique mountain retreats',
                'Zero hidden markups with transparent GST and service fee breakdown',
                'Comprehensive 24-hour flexible cancellation refund guarantees',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-navy-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
                alt="Tropical Island Haven"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-navy-950 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
              <div className="text-2xl font-serif font-bold text-ocean-400">100% Verified</div>
              <p className="text-xs text-charcoal-300 mt-1">Every property and route physically vetted by local specialists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PILLARS */}
      <section className="bg-slate-100/70 py-20 border-y border-charcoal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-ocean-600 uppercase tracking-widest">Core Values</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">Why Travel with VAYORA</h2>
            <p className="text-charcoal-600 text-sm">We combine human curation with smart technology to create effortless travel memories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-charcoal-100 shadow-soft space-y-4 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-navy-950 font-serif">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-ocean-600 uppercase tracking-widest">Leadership & Curation</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">Meet the Creators</h2>
          <p className="text-charcoal-600 text-sm">The minds and travelers engineering the future of travel discovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-charcoal-100 shadow-soft text-center p-6 space-y-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-ocean-100 shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-navy-950 font-serif">{member.name}</h3>
                <p className="text-xs font-semibold text-ocean-600 uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-ocean-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Ready to craft your next unforgettable journey?</h2>
          <p className="text-charcoal-300 max-w-xl mx-auto text-sm sm:text-base">
            Discover handpicked luxury packages, book boutique resorts, or let our Smart Trip Planner generate a custom itinerary in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/packages"
              className="px-6 py-3.5 rounded-xl bg-ocean-500 hover:bg-ocean-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/trip-planner"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Smart Trip Planner</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
