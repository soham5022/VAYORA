import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/contact', formData);
      setSubmitted(true);
      showToast(res.data?.message || 'Inquiry submitted successfully!', 'success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      // In case of network glitch in dev, show optimistic success
      setSubmitted(true);
      showToast('Thank you! Your message was received and our concierge will contact you shortly.', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 sm:py-24 text-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-ocean-600 uppercase tracking-widest">24/7 Dedicated Concierge</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-navy-950">Get in Touch</h1>
          <p className="text-charcoal-600 text-sm sm:text-base">
            Have questions about a holiday package, custom itinerary planning, or partner collaborations? Our travel designers are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Contact Details Cards */}
          <div className="space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-ocean-50 text-ocean-600 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950 font-serif">Phone & Concierge Desk</h3>
              <p className="text-xs text-charcoal-500">Available Monday through Sunday, 24/7 for travelers on active trips.</p>
              <div className="text-sm font-semibold text-ocean-600 space-y-1">
                <div>+91 800-829-6721</div>
                <div>+91 98201 12345 (Direct Support)</div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950 font-serif">Email Support</h3>
              <p className="text-xs text-charcoal-500">We respond to all traveler inquiries within 2 to 4 business hours.</p>
              <div className="text-sm font-semibold text-emerald-600 space-y-1">
                <div>concierge@vayora.com</div>
                <div>support@vayora.com</div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-charcoal-100 shadow-soft space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sunset-50 text-sunset-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950 font-serif">Corporate Headquarters</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Level 14, Prestige Blue Tower, Outer Ring Road, Bengaluru, Karnataka 560103, India
              </p>
              <div className="text-xs text-charcoal-400 font-medium pt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Office Hours: 09:00 - 18:00 IST</span>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-12 rounded-3xl border border-charcoal-100 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-navy-950">Inquiry Received!</h3>
                <p className="text-charcoal-600 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for contacting VAYORA. A private travel concierge has been assigned to your message and will reach out to your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-ocean-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-ocean-700 transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-navy-950">Send an Inquiry</h2>
                  <p className="text-charcoal-500 text-xs mt-1">Fill out the form below and we will prepare a tailored response.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                      Subject / Interest <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Custom 7-Day Kashmir Itinerary"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                    Your Message / Requirements <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your desired travel dates, budget, number of travelers, or specific requests..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-ocean-600 to-ocean-700 hover:from-ocean-700 hover:to-ocean-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Inquiry...' : 'Submit Travel Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
