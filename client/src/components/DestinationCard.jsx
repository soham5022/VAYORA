import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';

export default function DestinationCard({ destination }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(destination._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      itemType: 'destination',
      itemId: destination._id,
      title: destination.name,
      image: destination.images?.[0] || '',
      location: `${destination.state ? destination.state + ', ' : ''}${destination.country}`,
      price: destination.startingPrice,
      rating: destination.rating,
    });
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-charcoal-100 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal-100">
        <img
          src={destination.images?.[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-navy-950/70 text-white backdrop-blur-md">
            {destination.category || 'Explore'}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white scale-110 shadow-soft'
              : 'bg-white/80 text-charcoal-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-charcoal-900 text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-sunset-500 text-sunset-500" />
          <span>{destination.rating?.toFixed(1) || '4.8'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-ocean-700 mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {destination.state ? `${destination.state}, ` : ''}
              {destination.country}
            </span>
          </div>

          <h3 className="text-xl font-bold text-navy-950 group-hover:text-ocean-600 transition-colors">
            {destination.name}
          </h3>

          <p className="mt-2 text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Price & CTA Link */}
        <div className="mt-5 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-400 font-medium block">Starting from</span>
            <span className="text-lg font-extrabold text-navy-900">
              {formatCurrency(destination.startingPrice)}
            </span>
          </div>

          <Link
            to={`/destinations/${destination._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 group-hover:text-ocean-600 bg-charcoal-100/60 group-hover:bg-ocean-50 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
