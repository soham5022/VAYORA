import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export default function MyReviews() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews');
      const mine = (res.data.data || []).filter(
        (r) => r.user?._id === user?._id || r.user === user?._id
      );
      setReviews(mine);
    } catch (err) {
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      showToast('Review removed', 'info');
    } catch (err) {
      showToast('Failed to remove review', 'error');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="border-b border-charcoal-100 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
          My Reviews & Ratings
        </h1>
        <p className="text-xs text-charcoal-500">
          Reviews you have submitted for destinations, hotels, and holiday packages
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-charcoal-400">Loading your feedback...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">No reviews published yet</h3>
          <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
            You can leave a 1–5 star rating and comment on any destination, hotel, or package page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const targetTitle =
              rev.destination?.name ||
              rev.hotel?.name ||
              rev.package?.name ||
              rev.activity?.name ||
              'Travel Experience';

            return (
              <div
                key={rev._id}
                className="p-5 rounded-2xl border border-charcoal-100 hover:border-charcoal-200 transition-colors space-y-2 bg-charcoal-50/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">{targetTitle}</h3>
                    <span className="text-[10px] text-charcoal-400">{formatDate(rev.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex text-sunset-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-charcoal-600 leading-relaxed italic">"{rev.comment}"</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
