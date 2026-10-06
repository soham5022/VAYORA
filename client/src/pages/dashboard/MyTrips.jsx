import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Trash2, Calendar, MapPin, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTripId, setExpandedTripId] = useState(null);
  const { showToast } = useToast();

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res.data.data || []);
    } catch (err) {
      showToast('Failed to load saved trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Delete this saved custom trip?')) return;
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips((prev) => prev.filter((t) => t._id !== tripId));
      showToast('Trip removed', 'info');
    } catch (err) {
      showToast('Failed to delete trip', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Custom Planned Trips
          </h1>
          <p className="text-xs text-charcoal-500">
            Itineraries you designed with our intelligent rule-based trip planner
          </p>
        </div>

        <Link
          to="/trip-planner"
          className="px-5 py-2.5 rounded-2xl bg-navy-900 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-sunset-400" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-charcoal-400">Loading custom trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Compass className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No saved trips yet</h3>
          <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
            Build your personalized day-by-day travel plan using our Trip Planner engine.
          </p>
          <div className="pt-2">
            <Link
              to="/trip-planner"
              className="inline-block px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Start Planning Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => {
            const isExpanded = expandedTripId === trip._id;
            return (
              <div
                key={trip._id}
                className="border border-charcoal-100 rounded-2xl p-5 space-y-4 hover:border-charcoal-200 transition-colors shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-ocean-700">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trip.destination}</span>
                      <span>•</span>
                      <span>{trip.travelers} Travelers</span>
                    </div>
                    <h3 className="text-base font-bold text-navy-950 mt-0.5">{trip.title}</h3>
                    <p className="text-xs text-charcoal-400">
                      {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-charcoal-400 block font-bold uppercase">Estimated</span>
                      <span className="text-base font-extrabold text-navy-950">
                        {formatCurrency(trip.totalEstimatedCost)}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedTripId(isExpanded ? null : trip._id)}
                      className="p-2 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 text-charcoal-600"
                      title="Toggle Itinerary"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-200"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Day-by-Day schedule */}
                {isExpanded && (
                  <div className="border-t border-charcoal-100 pt-4 space-y-3 animate-in fade-in duration-150">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                      Itinerary Schedule
                    </h4>
                    <div className="space-y-2">
                      {trip.itinerary?.map((d) => (
                        <div key={d.day} className="p-3 rounded-xl bg-charcoal-50 text-xs space-y-1.5">
                          <div className="flex justify-between font-bold text-navy-950">
                            <span>Day {d.day}: {d.theme}</span>
                            <span>~{formatCurrency(d.estimatedCost)}</span>
                          </div>
                          <div className="space-y-1 text-charcoal-600">
                            {d.activities?.map((a, i) => (
                              <p key={i} className="text-[11px]">
                                • {a.time} - {a.activity} ({a.location})
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
