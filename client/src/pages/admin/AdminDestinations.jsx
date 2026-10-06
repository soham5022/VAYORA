import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, MapPin, Save, Star } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    state: '',
    category: 'Beach',
    startingPrice: 12000,
    rating: 4.8,
    bestTimeToVisit: 'October to March',
    description: '',
    images: '',
    attractions: '',
    activities: '',
  });

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/destinations');
      setDestinations(res.data.data || []);
    } catch (err) {
      showToast('Failed to load destinations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      country: 'India',
      state: '',
      category: 'Beach',
      startingPrice: 12000,
      rating: 4.8,
      bestTimeToVisit: 'October to March',
      description: '',
      images: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      attractions: 'Fort Aguada, Palolem Beach, Anjuna Flea Market',
      activities: 'Scuba Diving, Sunset Cruise, Beach Hopping',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dest) => {
    setEditingId(dest._id);
    setFormData({
      name: dest.name,
      country: dest.country,
      state: dest.state || '',
      category: dest.category || 'Beach',
      startingPrice: dest.startingPrice,
      rating: dest.rating,
      bestTimeToVisit: dest.bestTimeToVisit || '',
      description: dest.description,
      images: Array.isArray(dest.images) ? dest.images.join(', ') : '',
      attractions: Array.isArray(dest.attractions) ? dest.attractions.join(', ') : '',
      activities: Array.isArray(dest.activities) ? dest.activities.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.delete(`/destinations/${id}`);
      setDestinations((prev) => prev.filter((d) => d._id !== id));
      showToast('Destination deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete destination', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        startingPrice: Number(formData.startingPrice),
        rating: Number(formData.rating),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        attractions: formData.attractions.split(',').map((s) => s.trim()).filter(Boolean),
        activities: formData.activities.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const res = await api.put(`/destinations/${editingId}`, payload);
        showToast('Destination updated successfully', 'success');
        setDestinations((prev) => prev.map((d) => (d._id === editingId ? res.data.data : d)));
      } else {
        const res = await api.post('/destinations', payload);
        showToast('Destination created successfully', 'success');
        setDestinations((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Manage Destinations
          </h1>
          <p className="text-xs text-charcoal-500">
            Create, update, and manage global travel destinations in MongoDB
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Destination</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Starting Price</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((d) => (
              <tr key={d._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 font-bold text-navy-950 flex items-center gap-2.5">
                  <img
                    src={d.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span>{d.name}</span>
                </td>
                <td className="py-3.5 text-charcoal-600">
                  {d.state ? `${d.state}, ` : ''}{d.country}
                </td>
                <td className="py-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-ocean-50 text-ocean-700 font-bold text-[10px]">
                    {d.category}
                  </span>
                </td>
                <td className="py-3.5 font-bold text-navy-950">
                  {formatCurrency(d.startingPrice)}
                </td>
                <td className="py-3.5 flex items-center gap-1 text-sunset-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{d.rating?.toFixed(1) || '4.8'}</span>
                </td>
                <td className="py-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(d)}
                    className="p-1.5 text-charcoal-500 hover:text-navy-950 rounded-lg hover:bg-charcoal-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-charcoal-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
              <h3 className="text-lg font-bold text-navy-950 font-serif">
                {editingId ? 'Edit Destination' : 'Add New Destination'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-charcoal-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                    {['Beach', 'Mountain', 'Heritage', 'Nature', 'Adventure', 'City', 'Island', 'Romance'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Starting Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Image URLs (Comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Key Attractions (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.attractions}
                    onChange={(e) => setFormData({ ...formData, attractions: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Signature Activities (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.activities}
                    onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl p-3 text-xs"
                  />
                </div>
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
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
