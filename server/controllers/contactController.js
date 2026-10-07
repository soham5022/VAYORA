import ContactInquiry from '../models/ContactInquiry.js';

// @desc    Submit new contact inquiry
// @route   POST /api/contact
export const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const inquiry = await ContactInquiry.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Thank you for reaching out! A VAYORA travel concierge will respond within 24 hours.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries (Admin)
// @route   GET /api/contact
export const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update inquiry status (Admin)
// @route   PUT /api/contact/:id/status
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, ...(status === 'Resolved' ? { repliedAt: new Date() } : {}) },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
