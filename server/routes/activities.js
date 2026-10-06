import express from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(protect, adminOnly, createActivity);

router.route('/:id')
  .get(getActivityById)
  .put(protect, adminOnly, updateActivity)
  .delete(protect, adminOnly, deleteActivity);

export default router;
