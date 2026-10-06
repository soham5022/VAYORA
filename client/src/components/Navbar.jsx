import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Calendar,
  Menu,
  X,
  MapPin,
  Package,
  Hotel,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Destinations', path: '/destinations', icon: MapPin },
    { name: 'Packages', path: '/packages', icon: Package },
    { name: 'Hotels', path: '/hotels', icon: Hotel },
    { name: 'Experiences', path: '/activities', icon: Sparkles },
    { name: 'Trip Planner', path: '/trip-planner', icon: Calendar, badge: 'Smart' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-charcoal-100/80 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-700 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-6 h-6 text-sunset-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-navy-950 font-serif group-hover:text-ocean-600 transition-colors">
              VAYORA
            </span>
            <span className="text-[10px] tracking-widest text-charcoal-400 font-medium uppercase -mt-1">
              Travel Beyond
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'text-navy-900 bg-ocean-50/80 font-semibold'
                    : 'text-charcoal-600 hover:text-navy-900 hover:bg-charcoal-100/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive(link.path) ? 'text-ocean-600' : 'text-charcoal-400'}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-semibold bg-sunset-500/10 text-sunset-600 px-1.5 py-0.5 rounded-full ml-0.5">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth Profile */}
        <div className="flex items-center gap-3">
          {/* Wishlist Link */}
          <Link
            to={isAuthenticated ? '/dashboard/wishlist' : '/login'}
            className="relative p-2.5 rounded-xl text-charcoal-600 hover:text-navy-900 hover:bg-charcoal-100/60 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 text-charcoal-500 hover:text-sunset-500 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sunset-500 text-[10px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account Controls */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-charcoal-200/80 hover:border-ocean-500/40 bg-white hover:shadow-soft transition-all"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0B192C&color=fff`
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover border border-ocean-200"
                />
                <span className="text-sm font-semibold text-navy-900 hidden sm:inline max-w-[120px] truncate">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="w-4 h-4 text-charcoal-400" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-premium border border-charcoal-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-charcoal-100">
                    <p className="text-xs text-charcoal-400">Signed in as</p>
                    <p className="text-sm font-semibold text-navy-950 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md">
                        Admin Access
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-ocean-50 hover:text-navy-900"
                    >
                      <LayoutDashboard className="w-4 h-4 text-ocean-600" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-ocean-50 hover:text-navy-900"
                    >
                      <Calendar className="w-4 h-4 text-ocean-600" />
                      My Bookings
                    </Link>
                    <Link
                      to="/dashboard/trips"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-ocean-50 hover:text-navy-900"
                    >
                      <Compass className="w-4 h-4 text-ocean-600" />
                      Custom Trips
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-charcoal-700 hover:bg-ocean-50 hover:text-navy-900"
                    >
                      <User className="w-4 h-4 text-ocean-600" />
                      Profile & Settings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Admin Portal
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-charcoal-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/80 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-charcoal-700 hover:text-navy-900 hover:bg-charcoal-100/60 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-xl shadow-soft hover:shadow-premium transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-charcoal-600 hover:text-navy-900 hover:bg-charcoal-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-charcoal-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive(link.path)
                    ? 'text-navy-900 bg-ocean-50 font-semibold'
                    : 'text-charcoal-600 hover:bg-charcoal-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive(link.path) ? 'text-ocean-600' : 'text-charcoal-400'}`} />
                {link.name}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <div className="pt-4 border-t border-charcoal-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-charcoal-200 text-charcoal-800 font-semibold text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
