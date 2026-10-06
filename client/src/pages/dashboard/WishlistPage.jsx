import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Star, MapPin } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  const getItemLink = (item) => {
    if (item.itemType === 'destination') return `/destinations/${item.itemId}`;
    if (item.itemType === 'package') return `/packages/${item.itemId}`;
    if (item.itemType === 'hotel') return `/hotels/${item.itemId}`;
    return `/activities`;
  };

  return (
    <div className="bg-white rounded-3xl border border-charcoal-100 shadow-soft p-6 sm:p-8 space-y-6">
      <div className="border-b border-charcoal-100 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-navy-950">
          Saved Wishlist
        </h1>
        <p className="text-xs text-charcoal-500">
          Destinations, luxury resorts, packages, and experiences you have bookmarked
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-charcoal-400">Loading your saved items...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <Heart className="w-12 h-12 text-charcoal-300 mx-auto" />
          <h3 className="text-base font-bold text-navy-950">Your wishlist is empty</h3>
          <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
            Click the heart icon on any destination, hotel, or package to save it here.
          </p>
          <div className="pt-2">
            <Link
              to="/destinations"
              className="inline-block px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl overflow-hidden border border-charcoal-100 shadow-soft hover:shadow-premium transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-100">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy-950/75 text-white backdrop-blur-md">
                    {item.itemType}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 transition-colors shadow-xs"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-ocean-700">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-navy-950 truncate">{item.title}</h3>
                  {item.price > 0 && (
                    <p className="text-sm font-extrabold text-navy-950">
                      {formatCurrency(item.price)}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={getItemLink(item)}
                  className="w-full py-2 rounded-xl bg-charcoal-50 hover:bg-ocean-50 text-navy-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-charcoal-100"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
