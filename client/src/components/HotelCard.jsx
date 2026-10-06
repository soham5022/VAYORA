import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, Wifi, Coffee, Waves, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';

export default function HotelCard({ hotel }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(hotel._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      itemType: 'hotel',
      itemId: hotel._id,
      title: hotel.name,
      image: hotel.images?.[0] || '',
      location: hotel.location || hotel.destinationName,
      price: hotel.pricePerNight,
      rating: hotel.rating,
    });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-charcoal-100 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-100">
        <img
          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFav
              ? 'bg-rose-500 text-white scale-110 shadow-soft'
              : 'bg-white/80 text-charcoal-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Save hotel"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-charcoal-900 text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-sunset-500 text-sunset-500" />
          <span>{hotel.rating?.toFixed(1) || '4.8'}</span>
        </div>
      </div>

      {/* Hotel Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-ocean-700 mb-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{hotel.location || hotel.destinationName}</span>
          </div>

          <h3 className="text-lg font-bold text-navy-950 group-hover:text-ocean-600 transition-colors line-clamp-1">
            {hotel.name}
          </h3>

          <p className="mt-1 text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
            {hotel.description}
          </p>

          {/* Amenities preview */}
          {hotel.amenities && (
            <div className="mt-3 flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 3).map((amenity, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium text-charcoal-600 bg-charcoal-50 border border-charcoal-100 px-2 py-0.5 rounded-md"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Link */}
        <div className="mt-5 pt-4 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-400 font-medium block">Starting / night</span>
            <span className="text-lg font-extrabold text-navy-900">
              {formatCurrency(hotel.pricePerNight)}
            </span>
          </div>

          <Link
            to={`/hotels/${hotel._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-900 bg-charcoal-100/70 hover:bg-ocean-50 hover:text-ocean-700 px-3.5 py-2 rounded-xl transition-colors"
          >
            <span>View Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
