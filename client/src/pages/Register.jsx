import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    const res = await register(name, email, password, confirmPassword);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium border border-charcoal-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center text-sunset-500 shadow-soft">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-serif text-navy-950">VAYORA</span>
          </Link>
          <h2 className="text-xl font-bold text-navy-950">Create an Account</h2>
          <p className="text-xs text-charcoal-500">Join VAYORA to save itineraries, book stays & explore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

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
                placeholder="jane@example.com"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-navy-950 focus:outline-none focus:border-ocean-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-charcoal-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-ocean-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
