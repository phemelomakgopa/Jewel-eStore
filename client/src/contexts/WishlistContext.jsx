import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlistItems]);

  // Clear wishlist when user logs out
  useEffect(() => {
    if (!currentUser) {
      setWishlistItems([]);
    }
  }, [currentUser]);

  const addToWishlist = (product) => {
    if (!currentUser) {
      alert("Please sign in to add items to your wishlist");
      return false;
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      material: product.material,
      weight: product.weight,
      addedAt: new Date().toISOString(),
    };

    setWishlistItems((prev) => {
      // Check if item already exists
      if (prev.some((item) => item.id === product.id)) {
        return prev; // Don't add duplicates
      }
      return [...prev, productToAdd];
    });

    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false; // Removed
    } else {
      return addToWishlist(product); // Returns true if added, false if not signed in
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const moveToCart = (productId, addToCartFunction) => {
    const item = wishlistItems.find((item) => item.id === productId);
    if (item && addToCartFunction) {
      addToCartFunction(item, 1);
      removeFromWishlist(productId);
      return true;
    }
    return false;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    moveToCart,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
