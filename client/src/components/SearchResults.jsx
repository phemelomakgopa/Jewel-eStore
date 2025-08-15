import React, { useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import FilterPanel from './FilterPanel';
import WishlistButton from './WishlistButton';
import './SearchResults.css';

// Import product images
import bronzeRing from '../assets/Bronze_Ring.jpg';
import chainPearlyBracelet from '../assets/Chain+Pearly_Bracelet.jpg';
import chainDiamondBracelet from '../assets/ChainDiamond_Bracelet.jpg';
import diamondBracelet from '../assets/Diamond_Bracelet.jpg';
import diamondHeartEarrings from '../assets/Diamond_Heart_Earrings.jpg';
import diamondRing from '../assets/Diamond_Ring.jpg';
import diamondStoneGoldRing from '../assets/DiamondStone+GOld_Ring.jpg';
import distantPearlyBracelet from '../assets/Disntant_Pearly_Bracelet.jpg';
import flatPearlsBracelet from '../assets/Flat_Pearls_Bracelet.jpg';
import gearDiamondGoldRing from '../assets/GearDiamond+Gold_Ring.jpg';
import gearDiamondGoldRing2 from '../assets/GearDiamond+Gold_Ring2.jpg';
import gearDiamondGoldRing3 from '../assets/GearDiamond+Gold_Ring3.jpg';
import hookedPearlGoldHeartEarrings from '../assets/HookedPearl+GoldHeart_Earrings.jpg';
import heartPearlEarrings from '../assets/HeartPearl_Earrings.jpg';
import goldFloralEarrings from '../assets/GoldFloral_Earrings.jpg';
import goldChainedEarrings from '../assets/GoldChained_Earrings.jpg';
import goldWhiteyEarrings from '../assets/Gold+Whitey_Earrings.jpg';

const SearchResults = () => {
  const { searchQuery, searchResults, isSearching, getFilteredProductCount } = useSearch();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [addingToCart, setAddingToCart] = useState({});

  const productImages = {
    1: bronzeRing,
    2: chainPearlyBracelet,
    3: chainDiamondBracelet,
    4: diamondBracelet,
    5: diamondHeartEarrings,
    6: diamondRing,
    7: diamondStoneGoldRing,
    8: distantPearlyBracelet,
    9: flatPearlsBracelet,
    10: gearDiamondGoldRing,
    11: gearDiamondGoldRing2,
    12: gearDiamondGoldRing3,
    13: hookedPearlGoldHeartEarrings,
    14: heartPearlEarrings,
    15: goldFloralEarrings,
    16: goldChainedEarrings,
    17: goldWhiteyEarrings,
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(prev => ({ ...prev, [product.id]: true }));
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: productImages[product.id],
        stock: product.stock,
      });
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [product.id]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return `R${(price / 100).toFixed(2)}`;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 5) return { text: 'Low Stock', class: 'low-stock' };
    return { text: 'In Stock', class: 'in-stock' };
  };

  if (isSearching) {
    return (
      <div className="search-results">
        <div className="search-loading-container">
          <div className="search-loading-spinner"></div>
          <p>Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        <div className="search-results-info">
          <h1>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p>{getFilteredProductCount()} products found</p>
        </div>
        
        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
        </button>
      </div>

      <div className="search-results-content">
        <div className="search-filters-sidebar">
          <FilterPanel 
            isOpen={showFilters} 
            onToggle={() => setShowFilters(!showFilters)}
          />
        </div>

        <div className="search-results-grid">
          {searchResults.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3>No products found</h3>
              <p>
                {searchQuery 
                  ? `No products match "${searchQuery}". Try adjusting your search or filters.`
                  : 'No products match your current filters. Try adjusting your criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {searchResults.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const isAddingToCart = addingToCart[product.id];
                
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container">
                      <img
                        src={productImages[product.id]}
                        alt={product.name}
                        className="product-image"
                        onClick={() => handleProductClick(product.id)}
                      />
                      <div className="product-wishlist">
                        <WishlistButton 
                          product={{
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: productImages[product.id],
                          }}
                          size="medium"
                        />
                      </div>
                      <div className={`stock-badge ${stockStatus.class}`}>
                        {stockStatus.text}
                      </div>
                    </div>
                    
                    <div className="product-info">
                      <h3 
                        className="product-name"
                        onClick={() => handleProductClick(product.id)}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="product-details">
                        <p className="product-material">{product.material}</p>
                        <p className="product-weight">Weight: {product.weight}</p>
                      </div>
                      
                      <div className="product-price">
                        {formatPrice(product.price)}
                      </div>
                      
                      <button
                        className={`add-to-cart-btn ${isAddingToCart ? 'adding' : ''}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || isAddingToCart}
                      >
                        {isAddingToCart ? (
                          <>
                            <div className="btn-spinner"></div>
                            Adding...
                          </>
                        ) : product.stock === 0 ? (
                          'Out of Stock'
                        ) : (
                          'Add to Cart'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
