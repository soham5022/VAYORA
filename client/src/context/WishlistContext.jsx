import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.data?.success) {
        setWishlist(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (itemId) => {
    return wishlist.some((item) => item.itemId === itemId || item._id === itemId);
  };

  const toggleWishlist = async (itemData) => {
    if (!isAuthenticated) {
      showToast('Please sign in to save items to your wishlist', 'info');
      return false;
    }

    const { itemType, itemId, title, image, location, price, rating } = itemData;
    const exists = isInWishlist(itemId);

    if (exists) {
      try {
        await api.delete(`/wishlist/${itemId}`);
        setWishlist((prev) => prev.filter((i) => i.itemId !== itemId && i._id !== itemId));
        showToast(`Removed "${title}" from wishlist`, 'info');
        return false;
      } catch (err) {
        showToast('Failed to remove from wishlist', 'error');
        return true;
      }
    } else {
      try {
        const res = await api.post('/wishlist', {
          itemType,
          itemId,
          title,
          image,
          location,
          price,
          rating,
        });
        if (res.data?.success) {
          setWishlist((prev) => [res.data.data, ...prev]);
          showToast(`Saved "${title}" to your wishlist!`, 'success');
          return true;
        }
      } catch (err) {
        showToast('Failed to save to wishlist', 'error');
        return false;
      }
    }
  };

  const removeFromWishlist = async (idOrItemId) => {
    try {
      await api.delete(`/wishlist/${idOrItemId}`);
      setWishlist((prev) => prev.filter((i) => i._id !== idOrItemId && i.itemId !== idOrItemId));
      showToast('Item removed from wishlist', 'info');
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
