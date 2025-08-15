import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { wishlistItems, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!currentUser) {
    return (
      <div className="wishlist-container">
        <div className="auth-required">
          <h2>Sign In Required</h2>
          <p>Please sign in to view your wishlist.</p>
          <button
            onClick={() => navigate('/signin', { state: { from: '/wishlist' } })}
            className="btn btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-container">
        <div className="empty-wishlist">
          <div className="empty-icon">💝</div>
          <h2>Your Wishlist is Empty</h2>
          <p>Save items you love to your wishlist and shop them later!</p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleMoveToCart = (item) => {
    const success = moveToCart(item.id, addToCart);
    if (success) {
      // Optional: Show success message
      console.log(`${item.name} moved to cart!`);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <div className="wishlist-actions">
          <span className="item-count">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}</span>
          <button
            onClick={handleClearWishlist}
            className="btn btn-outline clear-btn"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-card">
            <div className="card-image" onClick={() => navigate(`/product/${item.id}`)}>
              <img src={item.image} alt={item.name} />
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.id);
                }}
                title="Remove from wishlist"
              >
                ×
              </button>
            </div>

            <div className="card-content">
              <h3 className="item-name" onClick={() => navigate(`/product/${item.id}`)}>
                {item.name}
              </h3>
              <p className="item-price">R{(item.price / 100).toFixed(2)}</p>
              
              <div className="item-meta">
                {item.category && <span className="category">{item.category}</span>}
                {item.material && <span className="material">{item.material}</span>}
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="btn btn-primary add-to-cart-btn"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="btn btn-outline view-btn"
                >
                  View Details
                </button>
              </div>

              <div className="added-date">
                Added {new Date(item.addedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wishlist-footer">
        <button
          onClick={() => navigate('/products')}
          className="btn btn-secondary continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
