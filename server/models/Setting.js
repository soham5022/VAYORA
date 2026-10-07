import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'VAYORA Travel Technologies Pvt Ltd',
    },
    tagline: {
      type: String,
      default: 'Travel beyond the ordinary.',
    },
    supportEmail: {
      type: String,
      default: 'support@vayora.com',
    },
    supportPhone: {
      type: String,
      default: '+91 800-829-6721',
    },
    address: {
      type: String,
      default: 'Level 14, Prestige Blue Tower, Outer Ring Road, Bengaluru, Karnataka 560103, India',
    },
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    taxRatePercent: {
      type: Number,
      default: 5.0, // 5% GST
    },
    serviceFeePercent: {
      type: Number,
      default: 2.5, // 2.5% platform booking fee
    },
    cancellationGraceHours: {
      type: Number,
      default: 48,
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/vayoratravel' },
      twitter: { type: String, default: 'https://twitter.com/vayoratravel' },
      linkedin: { type: String, default: 'https://linkedin.com/company/vayora' },
      facebook: { type: String, default: 'https://facebook.com/vayoratravel' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
