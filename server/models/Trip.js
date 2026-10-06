import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'My Custom Trip',
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    travelers: {
      type: Number,
      default: 1,
    },
    budget: {
      type: Number,
      default: 25000,
    },
    interests: {
      type: [String],
      default: ['Culture', 'Sightseeing'],
    },
    itinerary: [
      {
        day: { type: Number, required: true },
        theme: { type: String, default: 'Exploration' },
        activities: [{ time: String, activity: String, cost: Number, location: String }],
        estimatedCost: { type: Number, default: 0 },
      },
    ],
    totalEstimatedCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed'],
      default: 'Planned',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Trip', tripSchema);
