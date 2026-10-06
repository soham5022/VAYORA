import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      showToast(res.data.message || 'Reset instructions dispatched', 'info');
    } catch (err) {
      showToast(err.message || 'Account not found', 'error');
    } finally {
      setLoading(false);
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
          <h2 className="text-xl font-bold text-navy-950">Reset Password</h2>
          <p className="text-xs text-charcoal-500">
            Enter your email and we'll send demo instructions to reset your account.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-950">Password Reset Dispatched</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              If an account matches <strong>{email}</strong>, recovery instructions have been sent. For demo accounts, you can use the default password <code>Demo@123</code>.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block px-5 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-950 uppercase tracking-wider mb-1">
                Your Email
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-charcoal-100">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-ocean-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
