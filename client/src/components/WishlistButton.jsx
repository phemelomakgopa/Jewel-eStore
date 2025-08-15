import React, { useState, useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import './WishlistButton.css';
import { FaHeart} from "react-icons/fa";
import styles from './WishlistButton.css';

const WishlistButton = ({ product, size = 'medium', showText = false, className = '' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isInList, setIsInList] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsInList(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    const wasAdded = toggleWishlist(product);
    
    // Update local state
    setIsInList(!isInList);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
    
    // Show feedback message
    if (wasAdded) {
      // Could show a toast notification here
      console.log(`${product.name} added to wishlist!`);
    } else if (wasAdded === false && isInList) {
      console.log(`${product.name} removed from wishlist!`);
    }
  };

  const sizeClasses = {
    small: 'wishlist-btn-small',
    medium: 'wishlist-btn-medium',
    large: 'wishlist-btn-large'
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-button ${sizeClasses[size]} ${isInList ? 'active' : ''} ${isAnimating ? 'animating' : ''} ${className}`}
      title={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-label={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <span className="heart-icon">
        {isInList ? <FaHeart className={styles.heart} /> : '🤍'}
      </span>
      {showText && (
        <span className="wishlist-text">
          {isInList ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
