import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Sparkles, Star } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    destinationName: 'Goa',
    location: '',
    category: 'Adventure',
    price: 2500,
    duration: '3 Hours',
    rating: 4.8,
    description: '',
    images: '',
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/activities');
      setActivities(res.data.data || []);
    } catch (err) {
      showToast('Failed to load activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      destinationName: 'Goa',
      location: 'Grand Island, Goa',
      category: 'Water sports',
      price: 2999,
      duration: '4 Hours',
      rating: 4.8,
      description: '',
      images: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (act) => {
    setEditingId(act._id);
    setFormData({
      name: act.name,
      destinationName: act.destinationName,
      location: act.location,
      category: act.category,
      price: act.price,
      duration: act.duration,
      rating: act.rating,
      description: act.description,
      images: Array.isArray(act.images) ? act.images.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.delete(`/activities/${id}`);
      setActivities((prev) => prev.filter((a) => a._id !== id));
      showToast('Activity deleted', 'success');
    } catch (err) {
      showToast('Failed to delete activity', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const res = await api.put(`/activities/${editingId}`, payload);
        showToast('Activity updated successfully', 'success');
        setActivities((prev) => prev.map((a) => (a._id === editingId ? res.data.data : a)));
      } else {
        const res = await api.post('/activities', payload);
        showToast('Activity created successfully', 'success');
        setActivities((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filtered = activities.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Manage Activities
          </h1>
          <p className="text-xs text-charcoal-500">
            Configure outdoor sports, cultural food tours, and experiences
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Activity</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Price</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((act) => (
              <tr key={act._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 font-bold text-navy-950 max-w-[200px] truncate">{act.name}</td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-ocean-50 text-ocean-700 font-bold text-[10px]">
                    {act.category}
                  </span>
                </td>
                <td className="py-3.5 text-charcoal-600">{act.destinationName}</td>
                <td className="py-3.5 text-charcoal-500">{act.duration}</td>
                <td className="py-3.5 font-bold text-navy-950">{formatCurrency(act.price)}</td>
                <td className="py-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(act)}
                    className="p-1.5 text-charcoal-500 hover:text-navy-950 rounded-lg hover:bg-charcoal-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(act._id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-charcoal-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
              <h3 className="text-lg font-bold text-navy-950 font-serif">
                {editingId ? 'Edit Activity' : 'Add Activity'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-charcoal-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  >
                    {['Adventure', 'Water sports', 'Food', 'Nature', 'Culture', 'Photography', 'Relaxation', 'Romance'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-charcoal-200 text-xs font-bold text-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs shadow-soft"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
