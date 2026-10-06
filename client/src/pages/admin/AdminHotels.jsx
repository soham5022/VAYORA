import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Hotel, Star } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';

export default function AdminHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    destinationName: 'Goa',
    location: '',
    pricePerNight: 15000,
    rating: 4.8,
    description: '',
    images: '',
    amenities: '',
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hotels');
      setHotels(res.data.data || []);
    } catch (err) {
      showToast('Failed to load hotels', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      destinationName: 'Goa',
      location: 'Benaulim, South Goa',
      pricePerNight: 15000,
      rating: 4.8,
      description: '',
      images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      amenities: 'Free Wi-Fi, Swimming Pool, Spa & Wellness, Fine Dining, Airport Shuttle',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingId(h._id);
    setFormData({
      name: h.name,
      destinationName: h.destinationName,
      location: h.location,
      pricePerNight: h.pricePerNight,
      rating: h.rating,
      description: h.description,
      images: Array.isArray(h.images) ? h.images.join(', ') : '',
      amenities: Array.isArray(h.amenities) ? h.amenities.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await api.delete(`/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
      showToast('Hotel removed', 'success');
    } catch (err) {
      showToast('Failed to delete hotel', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        rating: Number(formData.rating),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        rooms: [
          {
            roomType: 'Deluxe Heritage Room',
            pricePerNight: Number(formData.pricePerNight),
            capacity: 2,
            bedType: 'King Bed',
            amenities: ['Free Wi-Fi', 'AC', 'Balcony'],
            available: true,
          },
          {
            roomType: 'Luxury Suite',
            pricePerNight: Math.round(Number(formData.pricePerNight) * 1.5),
            capacity: 3,
            bedType: 'King Bed + Sofa',
            amenities: ['Free Wi-Fi', 'Jacuzzi', 'Living Area'],
            available: true,
          },
        ],
      };

      if (editingId) {
        const res = await api.put(`/hotels/${editingId}`, payload);
        showToast('Hotel updated successfully', 'success');
        setHotels((prev) => prev.map((h) => (h._id === editingId ? res.data.data : h)));
      } else {
        const res = await api.post('/hotels', payload);
        showToast('Hotel added successfully', 'success');
        setHotels((prev) => [res.data.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.destinationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Manage Hotels & Stays
          </h1>
          <p className="text-xs text-charcoal-500">
            Configure boutique resorts, pricing per night, and amenities
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hotel</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">Hotel Name</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Base Price / Night</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((h) => (
              <tr key={h._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 font-bold text-navy-950 max-w-[220px] truncate">{h.name}</td>
                <td className="py-3.5 text-charcoal-600">{h.location || h.destinationName}</td>
                <td className="py-3.5 font-bold text-navy-950">{formatCurrency(h.pricePerNight)}</td>
                <td className="py-3.5 flex items-center gap-1 text-sunset-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{h.rating?.toFixed(1) || '4.8'}</span>
                </td>
                <td className="py-3.5 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(h)}
                    className="p-1.5 text-charcoal-500 hover:text-navy-950 rounded-lg hover:bg-charcoal-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(h._id)}
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
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-elevated border border-charcoal-100 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-4">
              <h3 className="text-lg font-bold text-navy-950 font-serif">
                {editingId ? 'Edit Hotel' : 'Add Hotel'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-charcoal-400 hover:text-navy-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Hotel Name
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
                    Location Address
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
                    Starting Price / Night (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy-950 uppercase mb-1">
                    Rating (1 to 5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
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
                    Amenities (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
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
                  Save Hotel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
