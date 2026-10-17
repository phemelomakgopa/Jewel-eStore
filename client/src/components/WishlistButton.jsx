import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import "./WishlistButton.css";

const WishlistButton = ({ product, size = "medium", showText = false, className = "" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product.id);
  const label = saved ? "Remove from wishlist" : "Save to wishlist";

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`wishlist-button wishlist-btn-${size} ${saved ? "active" : ""} ${showText ? "with-text" : ""} ${className}`}
      aria-pressed={saved}
      aria-label={showText ? undefined : `${label}: ${product.name}`}
      title={label}
    >
      <span className="heart-icon" aria-hidden="true">
        {saved ? <FaHeart /> : <FaRegHeart />}
      </span>
      {showText && <span className="wishlist-text">{saved ? "Saved to wishlist" : "Save to wishlist"}</span>}
    </button>
  );
};

export default WishlistButton;
