import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, MessageSquare, AlertTriangle } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reviews');
      setReviews(res.data.data || []);
    } catch (err) {
      showToast('Failed to load reviews for moderation', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete and moderate this review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      showToast('Review removed by moderator', 'success');
    } catch (err) {
      showToast('Failed to remove review', 'error');
    }
  };

  const filtered = reviews.filter((r) => {
    const text = (r.comment || '') + (r.user?.name || '') + (r.destination?.name || '') + (r.hotel?.name || '') + (r.package?.name || '');
    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Moderate Reviews
          </h1>
          <p className="text-xs text-charcoal-500">
            Inspect customer ratings, review feedback, and remove inappropriate content
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search reviews by traveler, comment, or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Author</th>
              <th className="pb-3">Reviewed Entity</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Feedback</th>
              <th className="pb-3">Date</th>
              <th className="pb-3 text-right">Moderate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((r) => {
              const entity =
                r.destination?.name ||
                r.hotel?.name ||
                r.package?.name ||
                r.activity?.name ||
                'General';

              return (
                <tr key={r._id} className="hover:bg-charcoal-50/50">
                  <td className="py-3.5">
                    <div className="font-bold text-navy-950">{r.user?.name || 'Customer'}</div>
                    <div className="text-[10px] text-charcoal-400">{r.user?.email}</div>
                  </td>
                  <td className="py-3.5 text-ocean-700 font-semibold">{entity}</td>
                  <td className="py-3.5">
                    <div className="flex text-sunset-500">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-charcoal-700 max-w-xs truncate italic">
                    "{r.comment}"
                  </td>
                  <td className="py-3.5 text-charcoal-500">{formatDate(r.createdAt)}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
