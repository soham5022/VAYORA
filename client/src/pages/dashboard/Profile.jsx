import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Lock, Save, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState([]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      setLocation(user.location || '');
      setPreferences(user.preferences || ['Beaches', 'Culture', 'Luxury']);
    }
  }, [user]);

  const travelStyles = [
    'Beaches',
    'Mountain',
    'Heritage',
    'Luxury',
    'Adventure',
    'Food & Wine',
    'Wildlife',
    'Relaxation',
  ];

  const togglePref = (p) => {
    setPreferences((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ name, phone, avatar, location, preferences });
    setSavingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setSavingPassword(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="border-b border-charcoal-100 pb-5">
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
            Profile & Travel Preferences
          </h1>
          <p className="text-xs text-charcoal-500">
            Manage your personal profile and preferred travel styles
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Email Address (Permanent)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-charcoal-100/60 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm text-charcoal-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mumbai, India"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="pt-2 border-t border-charcoal-100">
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-2">
              Favorite Travel Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((style) => {
                const isSelected = preferences.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => togglePref(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy-900 text-white shadow-xs'
                        : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-sunset-400" />}
                    <span>{style}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="border-b border-charcoal-100 pb-5">
          <h2 className="text-lg font-bold font-serif text-navy-950">Security & Password</h2>
          <p className="text-xs text-charcoal-500">Update your account password</p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl px-3.5 py-2 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft transition-all"
          >
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
