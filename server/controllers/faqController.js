import Faq from '../models/Faq.js';

// Pre-seeded comprehensive FAQs
const defaultFaqs = [
  {
    _id: 'faq_1',
    category: 'Bookings',
    question: 'How do I book a private holiday package or hotel with VAYORA?',
    answer: 'Select your preferred package, hotel, or experience, choose your travel dates and number of guests, apply any coupon codes, and proceed to checkout. You can securely pay via UPI, Credit/Debit cards, or Net Banking. Upon completion, you will immediately receive a confirmed voucher with a unique booking ID and printable tax invoice.',
    order: 1,
    isActive: true,
  },
  {
    _id: 'faq_2',
    category: 'Cancellations & Refunds',
    question: 'What is VAYORA’s cancellation and refund policy?',
    answer: 'We offer full 100% refunds for package cancellations made at least 48 hours prior to your scheduled departure. Cancellations between 48 and 24 hours qualify for a 50% refund. Cancellations under 24 hours are non-refundable due to supplier commitments. Refunds are processed automatically to the original payment source within 3-5 business days.',
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq_3',
    category: 'Payments',
    question: 'Are payments on VAYORA secure?',
    answer: 'Yes. All payments are processed through PCI-DSS Level 1 certified gateways including Razorpay with 256-bit SSL encryption. We never store your CVV or sensitive card numbers on our servers.',
    order: 3,
    isActive: true,
  },
  {
    _id: 'faq_4',
    category: 'Trip Planner',
    question: 'How does the Smart Trip Planner create custom itineraries?',
    answer: 'Our proprietary planning engine analyzes your selected destination, duration, budget, and travel interests (such as Culture, Nature, or Adventure). It automatically balances travel pace, recommends top attractions, estimates realistic costs, and allows you to customize and save your personal itinerary directly to your profile.',
    order: 4,
    isActive: true,
  },
  {
    _id: 'faq_5',
    category: 'General',
    question: 'Can I request bespoke customizations for private group departures?',
    answer: 'Absolutely. Contact our 24/7 Concierge team via the Contact Us page or email concierge@vayora.com. A dedicated travel designer will tailor flights, private villas, and personalized experiences to your group’s exact preferences.',
    order: 5,
    isActive: true,
  },
  {
    _id: 'faq_6',
    category: 'Safety & Trust',
    question: 'How does VAYORA verify hotels and tour operators?',
    answer: 'Every property and experience guide on VAYORA undergoes rigorous multi-point verification including hygiene audits, traveler safety protocols, background checks, and minimum 4.5-star quality standards.',
    order: 6,
    isActive: true,
  },
];

// @desc    Get all active FAQs (supports optional category filter & search)
// @route   GET /api/faqs
export const getFaqs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const faqs = await Faq.find(filter).sort({ order: 1, createdAt: 1 });
    if (faqs.length > 0) {
      return res.json({ success: true, count: faqs.length, data: faqs });
    }
    res.json({ success: true, count: defaultFaqs.length, data: defaultFaqs });
  } catch {
    res.json({ success: true, count: defaultFaqs.length, data: defaultFaqs });
  }
};

// @desc    Create FAQ (Admin)
// @route   POST /api/faqs
export const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update FAQ (Admin)
// @route   PUT /api/faqs/:id
export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete FAQ (Admin)
// @route   DELETE /api/faqs/:id
export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
