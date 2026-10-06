import React from 'react';
import { Star, MapPin, Clock, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';

export default function ActivityCard({ activity, onBookNow }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(activity._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      itemType: 'activity',
      itemId: activity._id,
      title: activity.name,
      image: activity.images?.[0] || '',
      location: activity.destinationName,
      price: activity.price,
      rating: activity.rating,
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-charcoal-100 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-100">
        <img
          src={activity.images?.[0] || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-950/75 text-white backdrop-blur-md text-xs font-semibold">
          <span>{activity.category}</span>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white scale-110 shadow-soft'
              : 'bg-white/80 text-charcoal-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save activity"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-charcoal-900 text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-sunset-500 text-sunset-500" />
          <span>{activity.rating?.toFixed(1) || '4.8'}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-charcoal-500 mb-1">
            <span className="flex items-center gap-1 text-ocean-700 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {activity.destinationName}
            </span>
            <span className="flex items-center gap-1 text-charcoal-400">
              <Clock className="w-3.5 h-3.5" />
              {activity.duration}
            </span>
          </div>

          <h3 className="text-lg font-bold text-navy-950 group-hover:text-ocean-600 transition-colors line-clamp-2">
            {activity.name}
          </h3>

          <p className="mt-1.5 text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-400 font-medium block">Per person</span>
            <span className="text-lg font-extrabold text-navy-900">
              {formatCurrency(activity.price)}
            </span>
          </div>

          <button
            onClick={() => onBookNow && onBookNow(activity)}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-navy-900 hover:bg-navy-800 px-4 py-2 rounded-xl transition-all shadow-soft"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
