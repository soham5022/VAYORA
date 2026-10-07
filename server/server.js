import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

// Route imports
import authRoutes from './routes/auth.js';
import destinationRoutes from './routes/destinations.js';
import packageRoutes from './routes/packages.js';
import hotelRoutes from './routes/hotels.js';
import activityRoutes from './routes/activities.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import tripRoutes from './routes/trips.js';
import adminRoutes from './routes/admin.js';
import couponRoutes from './routes/coupons.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';
import contactRoutes from './routes/contact.js';
import blogRoutes from './routes/blog.js';
import faqRoutes from './routes/faqs.js';
import settingRoutes from './routes/settings.js';
import vendorRoutes from './routes/vendors.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // allow modern inline assets & CDN images
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// General rate limiter (1000 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Non-blocking database connection trigger (never stalls HTTP response)
app.use((req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    connectDB().catch(() => {});
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VAYORA API',
    system: 'VAYORA Travel & Tourism Management System',
    timestamp: new Date().toISOString(),
  });
});

// Mount All REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server for local standalone runtime
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  connectDB().finally(() => {
    app.listen(PORT, () => {
      console.log(`[VAYORA Server] Running on http://localhost:${PORT}`);
    });
  });
}

export default app;
