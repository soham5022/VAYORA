import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart, Users, Check, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';

export default function PackageCard({ pkg, onBookNow }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(pkg._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      itemType: 'package',
      itemId: pkg._id,
      title: pkg.name,
      image: pkg.images?.[0] || '',
      location: pkg.destinationName,
      price: pkg.price,
      rating: pkg.rating,
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-charcoal-100 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-100">
        <img
          src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-950/75 text-white backdrop-blur-md text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-ocean-400" />
          <span>{pkg.duration}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white scale-110 shadow-soft'
              : 'bg-white/80 text-charcoal-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save package"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-charcoal-900 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-sunset-500 text-sunset-500" />
          <span>{pkg.rating?.toFixed(1) || '4.9'}</span>
        </div>
      </div>

      {/* Package Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ocean-600 block mb-1">
            {pkg.destinationName}
          </span>

          <h3 className="text-lg font-bold text-navy-950 group-hover:text-ocean-600 transition-colors line-clamp-1">
            {pkg.name}
          </h3>

          <p className="mt-1.5 text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>

          {/* Key Inclusions preview */}
          {pkg.included && pkg.included.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pkg.included.slice(0, 3).map((inc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-charcoal-600 bg-charcoal-50 px-2 py-0.5 rounded-md border border-charcoal-100"
                >
                  <Check className="w-3 h-3 text-emerald-500" />
                  {inc}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Footer Actions */}
        <div className="mt-5 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-400 font-medium block">Price per person</span>
            <span className="text-lg font-extrabold text-navy-900">
              {formatCurrency(pkg.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/packages/${pkg._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 bg-charcoal-100/70 hover:bg-ocean-50 hover:text-ocean-700 px-3.5 py-2 rounded-xl transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
