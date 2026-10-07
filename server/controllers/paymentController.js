import paymentService from '../services/paymentService.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

// @desc    Create Razorpay Payment Order
// @route   POST /api/payments/create-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', bookingId, notes = {} } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid payment amount required' });
    }

    const order = await paymentService.createOrder({
      amount: Number(amount),
      currency,
      receipt: bookingId || `rcpt_${Date.now()}`,
      notes,
    });

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification credentials' });
    }

    const isValid = paymentService.verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Transaction rejected.' });
    }

    // Update booking if provided
    if (bookingId) {
      const booking = await Booking.findOne({
        $or: [{ _id: bookingId }, { bookingId }],
      });
      if (booking) {
        booking.paymentStatus = 'Paid';
        booking.bookingStatus = 'Confirmed';
        booking.paymentId = razorpayPaymentId;
        booking.razorpayOrderId = razorpayOrderId;
        booking.razorpayPaymentId = razorpayPaymentId;
        booking.razorpaySignature = razorpaySignature;
        await booking.save();

        await Notification.create({
          user: booking.user,
          title: 'Payment Successful',
          message: `Payment of ₹${booking.totalAmount} for ${booking.itemName} received. Ref: ${razorpayPaymentId}`,
          type: 'payment',
          link: `/dashboard/bookings`,
        }).catch(() => {});
      }
    }

    res.json({
      success: true,
      message: 'Payment signature verified successfully',
      data: {
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        status: 'Paid',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Razorpay Webhook Handler
// @route   POST /api/payments/webhook
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const isValid = paymentService.verifyWebhookSignature(req.body, signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    console.log(`[Payment Webhook] Received verified event: ${event}`);

    if (event === 'payment.captured') {
      const payment = req.body.payload?.payment?.entity;
      if (payment?.notes?.bookingId) {
        await Booking.findOneAndUpdate(
          { bookingId: payment.notes.bookingId },
          { paymentStatus: 'Paid', bookingStatus: 'Confirmed', paymentId: payment.id }
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};
