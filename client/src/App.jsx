import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import AdminLayout from './pages/admin/AdminLayout';

// Guards
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Activities from './pages/Activities';
import TripPlanner from './pages/TripPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import BookingConfirmation from './pages/BookingConfirmation';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyBookings from './pages/dashboard/MyBookings';
import MyTrips from './pages/dashboard/MyTrips';
import WishlistPage from './pages/dashboard/WishlistPage';
import MyReviews from './pages/dashboard/MyReviews';
import Profile from './pages/dashboard/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminPackages from './pages/admin/AdminPackages';
import AdminHotels from './pages/admin/AdminHotels';
import AdminActivities from './pages/admin/AdminActivities';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WishlistProvider>
          <Routes>
            {/* Public and User Shared Routes (with Navbar & Footer) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:id" element={<PackageDetail />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/booking/confirmation/:id"
                element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                }
              />

              {/* User Dashboard Nested Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="trips" element={<MyTrips />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="reviews" element={<MyReviews />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Admin Portal Nested Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="destinations" element={<AdminDestinations />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="activities" element={<AdminActivities />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WishlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
