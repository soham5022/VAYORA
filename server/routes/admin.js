import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  getAdminBookings,
  updateBookingStatus,
  getAdminReviews,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(protect, adminOnly);

router.get('/dashboard', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/bookings', getAdminBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/reviews', getAdminReviews);

export default router;
