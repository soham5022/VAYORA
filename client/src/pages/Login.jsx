import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginDemoUser, loginDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    }
  };

  const handleDemoUser = async () => {
    setLoading(true);
    const res = await loginDemoUser();
    setLoading(false);
    if (res.success) navigate(redirectPath);
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    const res = await loginDemoAdmin();
    setLoading(false);
    if (res.success) navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium border border-charcoal-100 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center text-sunset-500 shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-serif text-navy-950">VAYORA</span>
          </Link>
          <h2 className="text-xl font-bold text-navy-950">Welcome Back</h2>
          <p className="text-xs text-charcoal-500">Sign in to manage your bookings, wishlist & itineraries</p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="p-4 rounded-2xl bg-ocean-50/70 border border-ocean-200/80 space-y-2.5">
          <span className="text-[11px] font-bold text-ocean-800 uppercase tracking-wider block">
            Academic Project Quick Evaluation
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoUser}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-white hover:bg-ocean-100/60 border border-ocean-200 text-xs font-bold text-navy-900 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-ocean-600" />
              <span>Demo Traveler</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-ocean-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-charcoal-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-ocean-600 hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
