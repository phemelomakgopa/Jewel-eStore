import React, { useState } from 'react';
import { useReviews } from '../contexts/ReviewsContext';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import './ReviewForm.css';

const ReviewForm = ({ productId, existingReview = null, onSuccess, onCancel }) => {
  const { addReview, updateReview, isLoading } = useReviews();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!existingReview;

  const validateForm = () => {
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please enter your review';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to leave a review');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateReview(existingReview.id, {
          rating: formData.rating,
          title: formData.title.trim(),
          comment: formData.comment.trim()
        });
      } else {
        await addReview({
          productId: parseInt(productId),
          rating: formData.rating,
          title: formData.title.trim(),
          comment: formData.comment.trim()
        });
      }

      // Reset form
      setFormData({ rating: 0, title: '', comment: '' });
      setErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!user) {
    return (
      <div className="review-form-signin">
        <div className="signin-prompt">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3>Sign in to leave a review</h3>
          <p>Share your experience with other customers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <div className="review-form-header">
        <h3>{isEditing ? 'Edit Your Review' : 'Write a Review'}</h3>
        <p>Share your experience with this product</p>
      </div>

      <form onSubmit={handleSubmit} className="review-form-content">
        {/* Rating */}
        <div className="form-group">
          <label className="form-label">
            Rating <span className="required">*</span>
          </label>
          <div className="rating-input">
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
              size="large"
              showValue={true}
            />
          </div>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="review-title" className="form-label">
            Review Title <span className="required">*</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your experience..."
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={100}
          />
          <div className="input-footer">
            <span className="char-count">{formData.title.length}/100</span>
          </div>
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        {/* Comment */}
        <div className="form-group">
          <label htmlFor="review-comment" className="form-label">
            Your Review <span className="required">*</span>
          </label>
          <textarea
            id="review-comment"
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Tell others about your experience with this product. What did you like or dislike? How was the quality? Would you recommend it?"
            className={`form-textarea ${errors.comment ? 'error' : ''}`}
            rows={5}
            maxLength={1000}
          />
          <div className="input-footer">
            <span className="char-count">{formData.comment.length}/1000</span>
          </div>
          {errors.comment && <span className="error-message">{errors.comment}</span>}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? (
              <>
                <div className="btn-spinner"></div>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              isEditing ? 'Update Review' : 'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
