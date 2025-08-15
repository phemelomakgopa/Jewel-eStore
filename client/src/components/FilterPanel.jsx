import React, { useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import './FilterPanel.css';

const FilterPanel = ({ isOpen, onToggle, className = '' }) => {
  const {
    filters,
    updateFilter,
    updatePriceRange,
    sortBy,
    setSortBy,
    clearFilters,
    getFilteredProductCount,
    getAvailableCategories,
    getAvailableMaterials,
    getPriceRange,
  } = useSearch();

  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const categories = getAvailableCategories();
  const materials = getAvailableMaterials();
  const { min: minPrice, max: maxPrice } = getPriceRange();

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: parseInt(value) };
    setPriceRange(newRange);
    updatePriceRange(newRange.min, newRange.max);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    clearFilters();
  };

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="filter-overlay" onClick={onToggle}></div>
      )}
      
      <div className={`filter-panel ${isOpen ? 'open' : ''} ${className}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="filter-close" onClick={onToggle}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="filter-content">
          {/* Results Count */}
          <div className="filter-results">
            <span>{getFilteredProductCount()} products found</span>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                />
                <span>All Categories</span>
              </label>
              {categories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                  />
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-label">Price Range</label>
            <div className="price-range">
              <div className="price-inputs">
                <div className="price-input-group">
                  <label>Min</label>
                  <input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="price-input"
                  />
                </div>
                <span className="price-separator">-</span>
                <div className="price-input-group">
                  <label>Max</label>
                  <input
                    type="number"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="price-input"
                  />
                </div>
              </div>
              <div className="price-range-slider">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="range-slider range-min"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="range-slider range-max"
                />
              </div>
              <div className="price-display">
                R{priceRange.min} - R{priceRange.max}
              </div>
            </div>
          </div>

          {/* Material Filter */}
          <div className="filter-section">
            <label className="filter-label">Material</label>
            <select
              value={filters.material}
              onChange={(e) => updateFilter('material', e.target.value)}
              className="filter-select"
            >
              <option value="">All Materials</option>
              {materials.map(material => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="filter-section">
            <label className="filter-option checkbox-option">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          <div className="filter-actions">
            <button
              onClick={handleClearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
