import React, { useState, useEffect } from 'react';
import { Search, UserCheck, Shield, ShieldAlert, Mail, MapPin } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      showToast('Failed to load user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    try {
      setUpdatingId(user._id);
      const res = await api.put(`/admin/users/${user._id}/role`, { role: newRole });
      if (res.data?.success) {
        showToast(`User role updated to ${newRole}`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-100 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Registered Users
          </h1>
          <p className="text-xs text-charcoal-500">
            View accounts, registration timestamps, and configure administrative roles
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter users by name, email, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-navy-950 focus:outline-none focus:border-ocean-600"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-charcoal-100 text-charcoal-400 uppercase tracking-wider font-bold">
              <th className="pb-3">User Profile</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Joined Date</th>
              <th className="pb-3">Access Role</th>
              <th className="pb-3 text-right">Role Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-50 font-medium">
            {filtered.map((u) => (
              <tr key={u._id} className="hover:bg-charcoal-50/50">
                <td className="py-3.5 flex items-center gap-3">
                  <img
                    src={
                      u.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=0B192C&color=fff`
                    }
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-navy-950">{u.name}</h4>
                    <span className="text-[10px] text-charcoal-400">{u.email}</span>
                  </div>
                </td>
                <td className="py-3.5 text-charcoal-600">{u.phone || '—'}</td>
                <td className="py-3.5 text-charcoal-600">{u.location || '—'}</td>
                <td className="py-3.5 text-charcoal-500">{formatDate(u.createdAt)}</td>
                <td className="py-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      u.role === 'ADMIN'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-charcoal-100 text-charcoal-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => handleRoleToggle(u)}
                    disabled={updatingId === u._id}
                    className="px-3 py-1.5 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 text-[11px] font-bold text-charcoal-700 transition-colors"
                  >
                    {u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
