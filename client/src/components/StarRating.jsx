import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  size = 'medium', 
  showValue = false,
  readonly = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !readonly && onRatingChange;

  const handleStarClick = (starRating) => {
    if (isInteractive) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (isInteractive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= displayRating;
    const isPartial = !isFilled && i - 0.5 <= displayRating;

    stars.push(
      <button
        key={i}
        type="button"
        className={`star ${isFilled ? 'filled' : ''} ${isPartial ? 'partial' : ''} ${
          isInteractive ? 'interactive' : ''
        }`}
        onClick={() => handleStarClick(i)}
        onMouseEnter={() => handleStarHover(i)}
        disabled={!isInteractive}
        aria-label={`${i} star${i !== 1 ? 's' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {isPartial && (
          <svg viewBox="0 0 24 24" fill="currentColor" className="partial-star">
            <defs>
              <linearGradient id={`half-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path 
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#half-${i})`}
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div 
      className={`star-rating ${size} ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stars">
        {stars}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
