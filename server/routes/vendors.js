import express from 'express';
import {
  registerVendor,
  getVendorDashboard,
  updateVendorStatus,
} from '../controllers/vendorController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', protect, registerVendor);
router.get('/dashboard', protect, getVendorDashboard);
router.put('/:id/status', protect, admin, updateVendorStatus);

export default router;
