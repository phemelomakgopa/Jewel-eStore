import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useAuth } from "../contexts/AuthContext";
import ProductCard from "./ProductCard";
import "./Wishlist.css";

const Wishlist = () => {
  const { currentUser } = useAuth();
  const { wishlistItems, clearWishlist } = useWishlist();

  if (!currentUser) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Your wishlist</h2>
          <p>Sign in to save pieces you love and come back to them on any visit.</p>
          <Link to="/signin" state={{ from: "/wishlist" }} className="btn btn-primary">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any piece to save it here.</p>
          <Link to="/products" className="btn btn-primary">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  const handleClear = () => {
    if (window.confirm(`Remove all ${wishlistItems.length} pieces from your wishlist?`)) clearWishlist();
  };

  return (
    <div className="page">
      <div className="wishlist-header">
        <h1 className="page-title">
          Wishlist <span className="wishlist-count">({wishlistItems.length})</span>
        </h1>
        <button type="button" onClick={handleClear} className="btn-link">
          Clear wishlist
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <ProductCard key={item.id} product={item} showMeta />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
