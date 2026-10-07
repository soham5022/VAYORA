import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function InvoiceModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = booking.invoiceNumber || `INV-${booking.bookingId || '2026-001'}`;
  const dateFormatted = formatDate(booking.createdAt || new Date());
  const travelDateFormatted = formatDate(booking.travelDate || booking.checkIn || new Date());

  const basePrice = booking.basePrice || booking.totalAmount;
  const quantity = booking.quantity || booking.travelers || 1;
  const subtotal = booking.subtotal || Math.round(basePrice * quantity);
  const taxAmount = booking.taxAmount || Math.round((subtotal * 0.05));
  const serviceFee = booking.serviceFee || Math.round((subtotal * 0.025));
  const discountAmount = booking.discountAmount || 0;
  const totalAmount = booking.totalAmount || (subtotal + taxAmount + serviceFee - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-charcoal-200 p-6 sm:p-10 relative">
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between pb-6 mb-6 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Official Tax Invoice & Voucher
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-charcoal-400 hover:text-charcoal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div className="space-y-8 text-navy-950 print:p-0">
          {/* Company & Voucher Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-charcoal-100">
            <div>
              <div className="text-3xl font-serif font-extrabold tracking-tight text-navy-950">VAYORA</div>
              <div className="text-xs text-ocean-600 font-bold uppercase tracking-wider mt-0.5">Travel beyond the ordinary</div>
              <p className="text-[11px] text-charcoal-500 mt-2 max-w-xs leading-relaxed">
                VAYORA Travel Technologies Pvt Ltd<br />
                Level 14, Prestige Blue Tower, Outer Ring Road<br />
                Bengaluru, Karnataka 560103, India<br />
                GSTIN: <strong>29AAACV5912K1Z8</strong>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xl font-serif font-bold text-navy-950">{invoiceNumber}</div>
              <div className="text-xs text-charcoal-500">Booking Reference: <strong className="text-ocean-600 font-mono">{booking.bookingId}</strong></div>
              <div className="text-xs text-charcoal-500">Issue Date: <strong>{dateFormatted}</strong></div>
              <div className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Payment Status: PAID
              </div>
            </div>
          </div>

          {/* Billed To / Guest Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/70 p-5 rounded-2xl border border-charcoal-100 text-xs">
            <div>
              <span className="font-bold text-charcoal-500 uppercase tracking-wider block mb-1">Primary Guest / Billed To:</span>
              <div className="font-bold text-sm text-navy-950">{booking.contactInfo?.name || 'Valued Guest'}</div>
              <div className="text-charcoal-600 mt-0.5">{booking.contactInfo?.email}</div>
              <div className="text-charcoal-600">{booking.contactInfo?.phone || 'Phone on file'}</div>
            </div>
            <div>
              <span className="font-bold text-charcoal-500 uppercase tracking-wider block mb-1">Reservation Schedule:</span>
              <div className="text-charcoal-700">Service: <strong>{booking.itemName}</strong></div>
              <div className="text-charcoal-700">Destination: <strong>{booking.destination || 'India'}</strong></div>
              <div className="text-charcoal-700">Travel Date: <strong>{travelDateFormatted}</strong></div>
              <div className="text-charcoal-700">Guests / Quantity: <strong>{quantity} Traveler(s)</strong></div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-charcoal-200 text-charcoal-500 uppercase tracking-wider font-bold">
                  <th className="py-3">Description</th>
                  <th className="py-3 text-center">Qty / Days</th>
                  <th className="py-3 text-right">Unit Price</th>
                  <th className="py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100">
                <tr>
                  <td className="py-4">
                    <div className="font-bold text-navy-950 text-sm">{booking.itemName}</div>
                    <div className="text-charcoal-500 text-[11px] mt-0.5">
                      {booking.type === 'package' ? 'All-inclusive curated holiday package' : booking.type === 'hotel' ? `Room Category: ${booking.roomType || 'Standard Luxury Room'}` : 'Curated local guided experience'}
                    </div>
                  </td>
                  <td className="py-4 text-center text-charcoal-700 font-semibold">{quantity}</td>
                  <td className="py-4 text-right text-charcoal-700">₹{Number(basePrice).toLocaleString('en-IN')}</td>
                  <td className="py-4 text-right font-bold text-navy-950">₹{Number(subtotal).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal:</span>
                <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>GST (5% Statutory Tax):</span>
                <span>₹{Number(taxAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-charcoal-600">
                <span>Platform Concierge Fee (2.5%):</span>
                <span>₹{Number(serviceFee).toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({booking.couponCode || 'APPLIED'}):</span>
                  <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t-2 border-charcoal-200 text-sm font-extrabold text-navy-950">
                <span>Final Total Paid:</span>
                <span className="text-ocean-600">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Security Sign-off */}
          <div className="pt-6 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-charcoal-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PCI-DSS Verified Electronic Transaction • Ref: {booking.paymentId || 'PAY-VERIFIED'}</span>
            </div>
            <div>Generated by VAYORA Core Enterprise Billing Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
}
