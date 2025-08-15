import React, { useState } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import './ReviewsList.css';

const ReviewsList = ({ productId }) => {
  const { 
    getProductReviews, 
    getProductRating, 
    getRatingDistribution,
    markHelpful,
    deleteReview,
    canUserReview,
    getUserReviewForProduct
  } = useReviews();
  const { user } = useAuth();
  
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);

  const reviews = getProductReviews(productId);
  const { average, count } = getProductRating(productId);
  const distribution = getRatingDistribution(productId);
  const userReview = getUserReviewForProduct(productId);
  const canReview = canUserReview(productId);

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setDeletingReview(reviewId);
      try {
        await deleteReview(reviewId);
      } catch (error) {
        alert('Failed to delete review. Please try again.');
      } finally {
        setDeletingReview(null);
      }
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getDistributionPercentage = (rating) => {
    return count > 0 ? Math.round((distribution[rating] / count) * 100) : 0;
  };

  if (showReviewForm) {
    return (
      <div className="reviews-section">
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onSuccess={handleReviewSuccess}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <div className="rating-number">{average.toFixed(1)}</div>
            <StarRating rating={average} size="large" readonly />
            <div className="rating-count">{count} review{count !== 1 ? 's' : ''}</div>
          </div>
          
          {count > 0 && (
            <div className="rating-distribution">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="distribution-row">
                  <span className="rating-label">{rating}</span>
                  <StarRating rating={1} size="small" readonly />
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ width: `${getDistributionPercentage(rating)}%` }}
                    ></div>
                  </div>
                  <span className="distribution-count">
                    {distribution[rating]} ({getDistributionPercentage(rating)}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review Button */}
        {user && canReview && (
          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Write a Review
          </button>
        )}

        {/* User's existing review notice */}
        {userReview && (
          <div className="user-review-notice">
            <p>You have already reviewed this product.</p>
            <button
              className="edit-review-link"
              onClick={() => handleEditReview(userReview)}
            >
              Edit your review
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {count > 0 && (
        <div className="reviews-list">
          <div className="reviews-header">
            <h3>Customer Reviews</h3>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          <div className="reviews-container">
            {sortedReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="reviewer-details">
                      <div className="reviewer-name">
                        {review.userName}
                        {review.verified && (
                          <span className="verified-badge">
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="review-date">{formatDate(review.date)}</div>
                    </div>
                  </div>
                  
                  <div className="review-actions">
                    {user && user.uid === review.userId && (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditReview(review)}
                          title="Edit review"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReview === review.id}
                          title="Delete review"
                        >
                          {deletingReview === review.id ? (
                            <div className="btn-spinner"></div>
                          ) : (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="review-rating">
                  <StarRating rating={review.rating} size="medium" readonly />
                </div>

                <div className="review-content">
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-comment">{review.comment}</p>
                </div>

                <div className="review-footer">
                  <button
                    className="helpful-btn"
                    onClick={() => markHelpful(review.id)}
                    disabled={!user}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Reviews State */}
      {count === 0 && (
        <div className="no-reviews">
          <div className="no-reviews-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience with this product!</p>
          {user && canReview && (
            <button
              className="write-first-review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Write the First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
