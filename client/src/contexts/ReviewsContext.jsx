import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReviewsContext = createContext();

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider');
  return ctx;
};

export const ReviewsProvider = ({ children }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock reviews data (in a real app, this would come from a backend)
  const mockReviews = [
    {
      id: 1,
      productId: 1,
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: null,
      rating: 5,
      title: 'Beautiful and well-crafted',
      comment: 'This bronze ring exceeded my expectations. The craftsmanship is excellent and it fits perfectly. I get compliments every time I wear it!',
      date: new Date('2024-07-15'),
      helpful: 12,
      verified: true,
      images: []
    },
    {
      id: 2,
      productId: 1,
      userId: 'user2',
      userName: 'Michael Chen',
      userAvatar: null,
      rating: 4,
      title: 'Great quality, fast shipping',
      comment: 'Really happy with this purchase. The ring looks exactly like the photos and arrived quickly. Only minor complaint is that it\'s slightly heavier than expected, but that actually makes it feel more premium.',
      date: new Date('2024-07-20'),
      helpful: 8,
      verified: true,
      images: []
    },
    {
      id: 3,
      productId: 2,
      userId: 'user3',
      userName: 'Emma Davis',
      userAvatar: null,
      rating: 5,
      title: 'Absolutely stunning bracelet!',
      comment: 'The pearls are gorgeous and the chain is delicate yet sturdy. Perfect for both casual and formal occasions. Will definitely be ordering more jewelry from this store.',
      date: new Date('2024-08-01'),
      helpful: 15,
      verified: true,
      images: []
    },
    {
      id: 4,
      productId: 6,
      userId: 'user4',
      userName: 'James Wilson',
      userAvatar: null,
      rating: 5,
      title: 'Perfect engagement ring',
      comment: 'Proposed with this ring and she said yes! The diamond is brilliant and the setting is beautiful. Excellent customer service throughout the process.',
      date: new Date('2024-08-10'),
      helpful: 25,
      verified: true,
      images: []
    },
    {
      id: 5,
      productId: 5,
      userId: 'user5',
      userName: 'Lisa Thompson',
      userAvatar: null,
      rating: 4,
      title: 'Love these earrings',
      comment: 'The heart shape is so cute and they\'re very comfortable to wear. The diamonds sparkle beautifully in the light. Only wish they came with better packaging.',
      date: new Date('2024-08-12'),
      helpful: 6,
      verified: true,
      images: []
    }
  ];

  // Load reviews from localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('jewelStore_reviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews).map(review => ({
        ...review,
        date: new Date(review.date)
      }));
      setReviews([...mockReviews, ...parsedReviews]);
    } else {
      setReviews(mockReviews);
    }
  }, []);

  // Save reviews to localStorage whenever reviews change
  useEffect(() => {
    if (reviews.length > mockReviews.length) {
      const userReviews = reviews.filter(review => 
        !mockReviews.some(mock => mock.id === review.id)
      );
      localStorage.setItem('jewelStore_reviews', JSON.stringify(userReviews));
    }
  }, [reviews]);

  const addReview = async (reviewData) => {
    if (!user) {
      throw new Error('You must be logged in to leave a review');
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReview = {
        id: Date.now(),
        productId: reviewData.productId,
        userId: user.uid,
        userName: user.displayName || user.email.split('@')[0],
        userAvatar: user.photoURL || null,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        date: new Date(),
        helpful: 0,
        verified: true, // In a real app, this would be based on purchase history
        images: reviewData.images || []
      };

      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId, updates) => {
    if (!user) {
      throw new Error('You must be logged in to update a review');
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setReviews(prev => prev.map(review => 
        review.id === reviewId && review.userId === user.uid
          ? { ...review, ...updates, date: new Date() }
          : review
      ));
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!user) {
      throw new Error('You must be logged in to delete a review');
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setReviews(prev => prev.filter(review => 
        !(review.id === reviewId && review.userId === user.uid)
      ));
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const markHelpful = async (reviewId) => {
    if (!user) return;

    const helpfulKey = `helpful_${reviewId}_${user.uid}`;
    const hasMarkedHelpful = localStorage.getItem(helpfulKey);

    if (hasMarkedHelpful) return;

    setReviews(prev => prev.map(review => 
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));

    localStorage.setItem(helpfulKey, 'true');
  };

  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === parseInt(productId));
  };

  const getUserReviews = (userId) => {
    return reviews.filter(review => review.userId === userId);
  };

  const getProductRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return { average: 0, count: 0 };

    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / productReviews.length;

    return {
      average: Math.round(average * 10) / 10,
      count: productReviews.length
    };
  };

  const getRatingDistribution = (productId) => {
    const productReviews = getProductReviews(productId);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    productReviews.forEach(review => {
      distribution[review.rating]++;
    });

    return distribution;
  };

  const canUserReview = (productId) => {
    if (!user) return false;
    
    // Check if user has already reviewed this product
    const existingReview = reviews.find(review => 
      review.productId === parseInt(productId) && review.userId === user.uid
    );

    return !existingReview;
  };

  const getUserReviewForProduct = (productId) => {
    if (!user) return null;
    
    return reviews.find(review => 
      review.productId === parseInt(productId) && review.userId === user.uid
    );
  };

  const getRecentReviews = (limit = 5) => {
    return [...reviews]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const getTopRatedProducts = (limit = 5) => {
    const productRatings = {};
    
    reviews.forEach(review => {
      if (!productRatings[review.productId]) {
        productRatings[review.productId] = { total: 0, count: 0 };
      }
      productRatings[review.productId].total += review.rating;
      productRatings[review.productId].count++;
    });

    return Object.entries(productRatings)
      .map(([productId, data]) => ({
        productId: parseInt(productId),
        average: data.total / data.count,
        count: data.count
      }))
      .filter(item => item.count >= 2) // Only include products with at least 2 reviews
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);
  };

  const value = {
    reviews,
    isLoading,
    addReview,
    updateReview,
    deleteReview,
    markHelpful,
    getProductReviews,
    getUserReviews,
    getProductRating,
    getRatingDistribution,
    canUserReview,
    getUserReviewForProduct,
    getRecentReviews,
    getTopRatedProducts,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};
