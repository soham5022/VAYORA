import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingInvoice,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.get('/:id/invoice', getBookingInvoice);
router.put('/:id/cancel', cancelBooking);

export default router;
