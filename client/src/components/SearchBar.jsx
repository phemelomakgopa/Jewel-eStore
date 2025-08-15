import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ className = '', placeholder = "Search products..." }) => {
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSearch = (query = localQuery) => {
    if (query.trim()) {
      setSearchQuery(query.trim());
      setShowSuggestions(false);
      navigate('/search');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Get search suggestions based on current input
  const getSuggestions = () => {
    if (!localQuery.trim() || localQuery.length < 2) return [];
    
    const query = localQuery.toLowerCase();
    const suggestions = new Set();
    
    // Add product name suggestions
    searchResults.slice(0, 5).forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
    });
    
    // Add category suggestions
    const categories = ['rings', 'bracelets', 'earrings', 'necklaces'];
    categories.forEach(category => {
      if (category.includes(query)) {
        suggestions.add(category.charAt(0).toUpperCase() + category.slice(1));
      }
    });
    
    // Add material suggestions
    const materials = ['Gold', 'Silver', 'Diamond', 'Pearl', 'Bronze', 'Platinum'];
    materials.forEach(material => {
      if (material.toLowerCase().includes(query)) {
        suggestions.add(material);
      }
    });
    
    return Array.from(suggestions).slice(0, 6);
  };

  const suggestions = getSuggestions();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`search-bar ${className}`} ref={searchRef}>
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <svg 
            className="search-icon" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            onClick={() => handleSearch()}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => localQuery.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="search-input"
          />
          
          {localQuery && (
            <button 
              className="clear-button"
              onClick={handleClear}
              type="button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {isSearching && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <svg className="suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
