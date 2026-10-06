import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Compass,
  Heart,
  Star,
  User,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
    { name: 'Custom Trips', path: '/dashboard/trips', icon: Compass },
    { name: 'Wishlist', path: '/dashboard/wishlist', icon: Heart, badge: wishlistCount },
    { name: 'My Reviews', path: '/dashboard/reviews', icon: Star },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Dashboard Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-charcoal-100 shadow-soft p-5 space-y-6">
          {/* User Profile Mini Banner */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-charcoal-100">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0B192C&color=fff`
              }
              alt={user?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-ocean-200"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-navy-950 truncate">{user?.name}</h3>
              <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
              {isAdmin && (
                <span className="inline-block text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md mt-1">
                  Administrator
                </span>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-navy-900 text-white shadow-soft'
                        : 'text-charcoal-600 hover:text-navy-950 hover:bg-charcoal-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[10px] bg-sunset-500 text-white px-2 py-0.5 rounded-full font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors mt-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Sign Out */}
          <div className="pt-4 border-t border-charcoal-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Sub-Route View */}
        <main className="lg:col-span-9 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
