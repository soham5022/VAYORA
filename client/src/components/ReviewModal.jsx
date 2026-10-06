import React, { useState } from 'react';
import { Star, X, Send, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ReviewModal({
  isOpen,
  onClose,
  targetType, // 'destination' | 'package' | 'hotel' | 'activity'
  targetId,
  targetTitle,
  onReviewSubmitted,
}) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to write a review', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please enter your review feedback', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        rating,
        comment: comment.trim(),
        [targetType]: targetId,
      };

      const res = await api.post('/reviews', payload);
      if (res.data?.success) {
        showToast('Thank you! Your review has been published.', 'success');
        setComment('');
        onClose();
        if (onReviewSubmitted) onReviewSubmitted(res.data.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-charcoal-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-navy-950 to-navy-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-ocean-300 font-semibold block">
              Share Your Experience
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-sm">
              Review: {targetTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-300 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Star selector */}
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-sunset-500 text-sunset-500'
                        : 'text-charcoal-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-navy-900">
                {rating} out of 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
              Written Feedback
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other travelers about your stay, highlights, or tips..."
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl p-3.5 text-sm text-navy-900 placeholder-charcoal-400 focus:outline-none focus:border-ocean-600 focus:bg-white transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-charcoal-200 text-charcoal-700 font-semibold text-sm hover:bg-charcoal-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
