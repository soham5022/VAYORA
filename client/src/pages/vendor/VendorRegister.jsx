import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function VendorRegister() {
  const { user, isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Hotels & Resorts',
    address: '',
    taxId: '',
    contactPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const businessTypes = [
    'Hotels & Resorts',
    'Tour Operator',
    'Experience Guide',
    'Transport',
    'Other',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please sign in to register as a partner', 'info');
      navigate('/login?redirect=/vendor/register');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/vendors/register', formData);
      showToast('Welcome! Your partner account is active.', 'success');
      navigate('/vendor/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-50 text-ocean-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>VAYORA Partner Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Become a VAYORA Travel Partner</h1>
          <p className="text-charcoal-600 text-sm sm:text-base">
            List your luxury resort, boutique villa, or signature local experience. Connect with thousands of high-value travelers globally.
          </p>
        </div>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-charcoal-100 shadow-xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Registered Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Kashmir Valley Villas Pvt Ltd"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Business Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  {businessTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  Contact Phone / Hotline
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="e.g. +91 98450 77123"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                  GST / Business Tax ID
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="e.g. 01AABCH9912L1Z9"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                Property / Operational Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001"
                className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Instant Partner Approval:</strong> As a verified travel operator, your dashboard and listing tools are enabled immediately upon registration.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting Application...' : 'Activate Partner Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
