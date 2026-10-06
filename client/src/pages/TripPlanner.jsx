import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Check,
  BookmarkPlus,
  ArrowRight,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calculateNights } from '../utils/formatters';

export default function TripPlanner() {
  const [searchParams] = useSearchParams();
  const prefilledDest = searchParams.get('destination') || 'Goa';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Planner Form
  const [destination, setDestination] = useState(prefilledDest);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(35000);
  const [selectedInterests, setSelectedInterests] = useState(['Nature', 'Culture', 'Relaxation']);

  // Results state
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
  const [saving, setSaving] = useState(false);

  const interestOptions = [
    'Nature',
    'Adventure',
    'Food',
    'Culture',
    'Photography',
    'Relaxation',
    'Water sports',
    'Nightlife',
  ];

  // Fetch destinations for dropdown
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoadingDestinations(true);
        const res = await api.get('/destinations');
        setAvailableDestinations(res.data.data || []);
      } catch (err) {
        console.error('Failed to load destinations for planner:', err);
      } finally {
        setLoadingDestinations(false);
      }
    };

    loadDestinations();

    // Default dates: next week for 4 days
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    const fmt = (d) => d.toISOString().split('T')[0];
    setStartDate(fmt(start));
    setEndDate(fmt(end));
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Rule-based Itinerary Generator
  const generateItinerary = (e) => {
    if (e) e.preventDefault();

    const daysCount = calculateNights(startDate, endDate) || 3;
    const matchedDest = availableDestinations.find(
      (d) => d.name.toLowerCase() === destination.toLowerCase()
    );

    const destName = matchedDest ? matchedDest.name : destination;
    const attractions = matchedDest?.attractions || ['City Heritage Walk', 'Sunset Viewpoint', 'Local Artisan Market'];
    const activities = matchedDest?.activities || ['Scenic Boat Ride', 'Cultural Folk Dinner', 'Nature Trek'];

    const itinerary = [];
    const dailyBaseBudget = Math.round(budget / daysCount);

    for (let day = 1; day <= daysCount; day++) {
      let theme = 'Arrival & Orientation';
      let dayActivities = [];

      if (day === 1) {
        theme = 'Arrival, Check-in & Scenic Sunset';
        dayActivities = [
          { time: '11:00 AM', activity: `Arrive in ${destName} & check in at luxury stay`, cost: Math.round(dailyBaseBudget * 0.4), location: `${destName} Central` },
          { time: '02:30 PM', activity: `Savor authentic local delicacies at renowned cafe`, cost: Math.round(dailyBaseBudget * 0.15), location: 'Historic Quarter' },
          { time: '05:30 PM', activity: `Golden hour sunset stroll at ${attractions[0] || 'Sunset Point'}`, cost: 0, location: attractions[0] || 'Promenade' },
        ];
      } else if (day === daysCount) {
        theme = 'Artisan Souvenirs & Departure';
        dayActivities = [
          { time: '09:30 AM', activity: `Morning leisure walk and local market shopping`, cost: Math.round(dailyBaseBudget * 0.25), location: 'Local Bazaars' },
          { time: '01:00 PM', activity: `Farewell traditional lunch and airport/station transfer`, cost: Math.round(dailyBaseBudget * 0.2), location: `${destName} Terminal` },
        ];
      } else {
        const attraction = attractions[(day - 1) % attractions.length] || 'Heritage Monument';
        const signatureAct = activities[(day - 1) % activities.length] || selectedInterests[0] || 'Exploration';

        theme = `${signatureAct} & ${attraction}`;
        dayActivities = [
          { time: '09:00 AM', activity: `Guided morning excursion to ${attraction}`, cost: Math.round(dailyBaseBudget * 0.25), location: attraction },
          { time: '02:00 PM', activity: `Immersive experience: ${signatureAct} with local guides`, cost: Math.round(dailyBaseBudget * 0.35), location: `${destName} Countryside` },
          { time: '07:30 PM', activity: `Candlelit dinner featuring local organic cuisine`, cost: Math.round(dailyBaseBudget * 0.2), location: 'Waterfront / Rooftop' },
        ];
      }

      const dayCost = dayActivities.reduce((sum, item) => sum + item.cost, 0);

      itinerary.push({
        day,
        theme,
        activities: dayActivities,
        estimatedCost: dayCost,
      });
    }

    const totalEstimatedCost = itinerary.reduce((sum, d) => sum + d.estimatedCost, 0);

    setGeneratedPlan({
      destination: destName,
      days: daysCount,
      travelers,
      budget,
      interests: selectedInterests,
      itinerary,
      totalEstimatedCost,
    });
  };

  // Run generation initially when destinations load
  useEffect(() => {
    if (availableDestinations.length > 0 && !generatedPlan) {
      generateItinerary();
    }
  }, [availableDestinations]);

  // Save Trip to MongoDB
  const handleSaveTrip = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to save this trip to your dashboard', 'info');
      navigate('/login');
      return;
    }

    if (!generatedPlan) return;

    try {
      setSaving(true);
      const payload = {
        title: `${generatedPlan.destination} ${generatedPlan.days}-Day Getaway`,
        destination: generatedPlan.destination,
        startDate,
        endDate,
        travelers: Number(travelers),
        budget: Number(budget),
        interests: selectedInterests,
        itinerary: generatedPlan.itinerary,
        totalEstimatedCost: generatedPlan.totalEstimatedCost,
      };

      const res = await api.post('/trips', payload);
      if (res.data?.success) {
        showToast('Trip successfully saved to your dashboard! 🎉', 'success');
        navigate('/dashboard/trips');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save trip', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Rule-Based Itinerary Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 font-serif">
          Interactive Trip Planner
        </h1>
        <p className="text-sm text-charcoal-500 max-w-2xl">
          Customize your destination, dates, budget, and travel preferences. VAYORA instantly designs a personalized day-by-day plan with activity schedules and cost estimates.
        </p>
      </div>

      {/* Grid: Form on Left, Generated Plan on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Planner Inputs Form */}
        <form
          onSubmit={generateItinerary}
          className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-6"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-400 border-b border-charcoal-100 pb-3">
            <Briefcase className="w-4 h-4 text-ocean-600" />
            <span>Customize Trip Parameters</span>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
              Target Destination
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-ocean-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-semibold text-navy-950 focus:outline-none focus:border-ocean-600 cursor-pointer"
              >
                {availableDestinations.map((d) => (
                  <option key={d._id} value={d.name}>
                    {d.name} ({d.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          {/* Travelers & Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-ocean-600 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8].map((t) => (
                  <option key={t} value={t}>{t} {t > 1 ? 'Travelers' : 'Traveler'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Total Budget
              </label>
              <input
                type="number"
                min="5000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value) || 10000)}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
              Select Interests & Vibe
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy-900 text-white shadow-xs'
                        : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-sunset-400" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft hover:shadow-premium transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-sunset-400" />
            <span>Generate Custom Itinerary</span>
          </button>
        </form>

        {/* Generated Itinerary Output */}
        <div className="lg:col-span-7 space-y-6">
          {generatedPlan ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Itinerary Header Banner */}
              <div className="bg-gradient-to-r from-navy-950 to-navy-900 text-white p-6 sm:p-7 rounded-3xl shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-ocean-300 font-semibold uppercase tracking-wider block mb-1">
                    {generatedPlan.days} Days • {generatedPlan.travelers} Travelers
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-white">
                    {generatedPlan.destination} Adventure
                  </h2>
                  <p className="text-xs text-charcoal-300 mt-1">
                    Estimated Budget: <span className="font-extrabold text-sunset-400">{formatCurrency(generatedPlan.totalEstimatedCost)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveTrip}
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sunset-500 hover:bg-sunset-600 text-white font-bold text-xs shadow-soft transition-all flex items-center gap-1.5"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Trip'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/packages?destination=${encodeURIComponent(generatedPlan.destination)}`)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-colors"
                  >
                    Explore Packages
                  </button>
                </div>
              </div>

              {/* Day-by-day Itinerary Cards */}
              <div className="space-y-4">
                {generatedPlan.itinerary.map((dayPlan) => (
                  <div
                    key={dayPlan.day}
                    className="bg-white p-5 sm:p-6 rounded-3xl border border-charcoal-100 shadow-soft space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-2xl bg-ocean-50 text-ocean-700 font-black text-xs flex items-center justify-center border border-ocean-100">
                          DAY {dayPlan.day}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-navy-950">
                            {dayPlan.theme}
                          </h3>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-charcoal-600 bg-charcoal-50 px-2.5 py-1 rounded-lg">
                        ~{formatCurrency(dayPlan.estimatedCost)}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {dayPlan.activities.map((act, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between gap-3 text-xs p-3 rounded-2xl bg-charcoal-50/70 border border-charcoal-100/60"
                        >
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-ocean-700 block">
                              {act.time} • {act.location}
                            </span>
                            <p className="font-semibold text-navy-950">{act.activity}</p>
                          </div>
                          {act.cost > 0 && (
                            <span className="text-[11px] font-bold text-charcoal-500 whitespace-nowrap">
                              {formatCurrency(act.cost)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-charcoal-100 text-center space-y-3">
              <Compass className="w-12 h-12 text-ocean-600 mx-auto" />
              <h3 className="text-lg font-bold text-navy-950">Ready to Plan</h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                Select your travel details on the left and click "Generate Custom Itinerary" to preview your personalized itinerary.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
