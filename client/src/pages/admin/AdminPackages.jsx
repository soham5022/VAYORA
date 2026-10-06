import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Package, Star } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    destinationName: 'Goa',
    duration: '5 Days / 4 Nights',
    price: 19999,
    maxTravelers: 8,
    rating: 4.9,
    description: '',
    images: '',
    included: '',
    excluded: '',
  });

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/packages');
      setPackages(res.data.data || []);
    } catch (err) {
      showToast('Failed to load packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      destinationName: 'Goa',
      duration: '5 Days / 4 Nights',
      price: 19999,
      maxTravelers: 8,
      rating: 4.9,
      description: '',
      images: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      included: 'Luxury Resort Stay, Daily Breakfast, Airport Transfers, Guided Sightseeing',
      excluded: 'Flights, Personal Expenses, Travel Insurance',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingId(pkg._id);
    setFormData({
      name: pkg.name,
      destinationName: pkg.destinationName,
      duration: pkg.duration,
      price: pkg.price,
      maxTravelers: pkg.maxTravelers,
      rating: pkg.rating,
      description: pkg.description,
      images: Array.isArray(pkg.images) ? pkg.images.join(', ') : '',
      included: Array.isArray(pkg.included) ? pkg.included.join(', ') : '',
      excluded: Array.isArray(pkg.excluded) ? pkg.excluded.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      showToast('Package deleted', 'success');
    } catch (err) {
      showToast('Failed to delete package', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        maxTravelers: Number(formData.maxTravelers),
        rating: Number(formData.rating),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        included: formData.included.split(',').map((s) => s.trim()).filter(Boolean),
        excluded: formData.excluded.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const res = await api.put(`/packages/${editingId}`, payload);
        showToast('Package updated successfully', 'success');
        setPackages((prev) => prev.map((p) => (p._id === editingId ? res.data.data : p)));
      } else {
        const res = await api.post('/packages', payload);
        showToast('Package created successfully', 'success');
        setPackages((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filtered = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Manage Packages
          </h1>
          <p className="text-xs text-charcoal-500">
            Add, update, or remove curated travel packages and itineraries
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter packages by name or destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Package Name</th>
              <th className="pb-3">Destination</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Price / Person</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((pkg) => (
              <tr key={pkg._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 font-bold text-navy-950 max-w-[220px] truncate">{pkg.name}</td>
                <td className="py-3.5 text-ocean-700 font-semibold">{pkg.destinationName}</td>
                <td className="py-3.5 text-charcoal-600">{pkg.duration}</td>
                <td className="py-3.5 font-bold text-navy-950">{formatCurrency(pkg.price)}</td>
                <td className="py-3.5 flex items-center gap-1 text-sunset-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{pkg.rating?.toFixed(1) || '4.9'}</span>
                </td>
                <td className="py-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 text-charcoal-500 hover:text-navy-950 rounded-lg hover:bg-charcoal-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-charcoal-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
              <h3 className="text-lg font-bold text-navy-950 font-serif">
                {editingId ? 'Edit Package' : 'Create Package'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-charcoal-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Package Name
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

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Price per Person (₹)
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
                    Max Travelers
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.maxTravelers}
                    onChange={(e) => setFormData({ ...formData, maxTravelers: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Image URLs (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Included Services (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.included}
                    onChange={(e) => setFormData({ ...formData, included: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Excluded Services (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.excluded}
                    onChange={(e) => setFormData({ ...formData, excluded: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
