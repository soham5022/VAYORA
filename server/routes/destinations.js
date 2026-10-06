import express from 'express';
import {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getDestinations)
  .post(protect, adminOnly, createDestination);

router.route('/:id')
  .get(getDestinationById)
  .put(protect, adminOnly, updateDestination)
  .delete(protect, adminOnly, deleteDestination);

export default router;
