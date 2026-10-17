import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProductById } from "../data/products";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

// Saved per user so two people sharing a browser don't see each other's lists.
const storageKey = (uid) => `wishlist:${uid}`;

const load = (uid) => {
  if (!uid) return [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(uid)) || "[]");
    return saved.filter((entry) => getProductById(entry.id));
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { notify } = useToast();
  const location = useLocation();
  const uid = currentUser?.uid;
  const [entries, setEntries] = useState(() => load(uid));

  useEffect(() => {
    setEntries(load(uid));
  }, [uid]);

  const persist = (next) => {
    setEntries(next);
    if (!uid) return;
    try {
      localStorage.setItem(storageKey(uid), JSON.stringify(next));
    } catch {}
  };

  // Entries only hold id + date; product details come from the catalogue.
  const wishlistItems = entries
    .map((entry) => {
      const product = getProductById(entry.id);
      return product ? { ...product, addedAt: entry.addedAt } : null;
    })
    .filter(Boolean);

  const isInWishlist = (productId) => entries.some((e) => e.id === Number(productId));

  const addToWishlist = (product) => {
    if (!uid) {
      notify("Sign in to save pieces to your wishlist.", {
        action: { label: "Sign in", to: "/signin", state: { from: location.pathname + location.search } },
      });
      return false;
    }
    if (isInWishlist(product.id)) return true;
    persist([...entries, { id: Number(product.id), addedAt: new Date().toISOString() }]);
    notify(`${product.name} saved to your wishlist.`, { action: { label: "View wishlist", to: "/wishlist" } });
    return true;
  };

  const removeFromWishlist = (productId) => {
    persist(entries.filter((e) => e.id !== Number(productId)));
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      notify(`${product.name} removed from your wishlist.`);
      return false;
    }
    return addToWishlist(product);
  };

  const clearWishlist = () => persist([]);

  const getWishlistCount = () => entries.length;

  const moveToCart = (productId, addToCart) => {
    const added = addToCart(productId, 1);
    if (added) removeFromWishlist(productId);
    return added;
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

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
