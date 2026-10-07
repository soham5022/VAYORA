import express from 'express';
import {
  submitInquiry,
  getAllInquiries,
  updateInquiryStatus,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitInquiry);
router.get('/', protect, admin, getAllInquiries);
router.put('/:id/status', protect, admin, updateInquiryStatus);

export default router;
