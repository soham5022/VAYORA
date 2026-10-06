import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  MapPin,
  Package,
  Hotel,
  Sparkles,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  LogOut,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { name: 'Analytics Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Manage Packages', path: '/admin/packages', icon: Package },
    { name: 'Manage Hotels', path: '/admin/hotels', icon: Hotel },
    { name: 'Manage Activities', path: '/admin/activities', icon: Sparkles },
    { name: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Moderate Reviews', path: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Admin Top Banner */}
      <header className="bg-navy-950 text-white border-b border-navy-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-soft font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold font-serif text-white tracking-tight">
                VAYORA Admin
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-md">
                Management Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-charcoal-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-charcoal-100 shadow-soft p-4 space-y-2">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              System Administration
            </div>
            <nav className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-navy-900 text-white shadow-soft'
                          : 'text-charcoal-600 hover:text-navy-950 hover:bg-charcoal-50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* Admin Main Outlet */}
          <main className="lg:col-span-9 space-y-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
