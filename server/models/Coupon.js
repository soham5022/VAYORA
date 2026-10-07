import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: null, // null means no cap for percentage
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    usageLimit: {
      type: Number,
      default: 1000,
    },
    perUserLimit: {
      type: Number,
      default: 1,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

couponSchema.methods.isValidForOrder = function (amount, userId = null) {
  const now = new Date();
  if (!this.isActive) return { valid: false, reason: 'Coupon is no longer active' };
  if (this.validFrom && now < this.validFrom) return { valid: false, reason: 'Coupon is not yet active' };
  if (this.validUntil && now > this.validUntil) return { valid: false, reason: 'Coupon has expired' };
  if (this.usageLimit && this.timesUsed >= this.usageLimit) return { valid: false, reason: 'Coupon usage limit reached' };
  if (this.minOrderAmount && amount < this.minOrderAmount) {
    return { valid: false, reason: `Minimum order amount of ₹${this.minOrderAmount} required` };
  }

  if (userId && this.perUserLimit) {
    const userUses = this.usedBy.filter((u) => u.user?.toString() === userId.toString()).length;
    if (userUses >= this.perUserLimit) {
      return { valid: false, reason: 'You have already used this coupon maximum allowed times' };
    }
  }

  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (amount) {
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = Math.min(this.discountValue, amount);
  }
  return Math.round(discount);
};

export default mongoose.model('Coupon', couponSchema);
