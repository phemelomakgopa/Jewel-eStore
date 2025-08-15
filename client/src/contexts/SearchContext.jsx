import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 10000 },
    material: '',
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('name'); // name, price-low, price-high, newest
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // All products data (this would normally come from an API)
  const allProducts = [
    { 
      id: 1, 
      name: "Bronze Ring", 
      price: 1999, 
      category: "rings",
      material: "Bronze",
      weight: "8g",
      stock: 15,
      createdAt: new Date('2024-01-15'),
      description: "A stunning bronze ring crafted with precision and care."
    },
    { 
      id: 2, 
      name: "Chain & Pearly Bracelet", 
      price: 4599, 
      category: "bracelets",
      material: "Sterling Silver, Freshwater Pearls",
      weight: "12g",
      stock: 8,
      createdAt: new Date('2024-02-01'),
      description: "An exquisite bracelet featuring delicate pearls interwoven with a fine chain."
    },
    { 
      id: 3, 
      name: "Chain Diamond Bracelet", 
      price: 7999, 
      category: "bracelets",
      material: "18K Gold, Diamonds",
      weight: "15g",
      stock: 5,
      createdAt: new Date('2024-02-15'),
      description: "A luxurious diamond bracelet that sparkles with every movement."
    },
    { 
      id: 4, 
      name: "Diamond Bracelet", 
      price: 9999, 
      category: "bracelets",
      material: "18K White Gold, Premium Diamonds",
      weight: "18g",
      stock: 3,
      createdAt: new Date('2024-03-01'),
      description: "An extraordinary diamond bracelet showcasing brilliant-cut diamonds."
    },
    { 
      id: 5, 
      name: "Diamond Heart Earrings", 
      price: 5999, 
      category: "earrings",
      material: "18K Rose Gold, Diamonds",
      weight: "6g",
      stock: 12,
      createdAt: new Date('2024-03-15'),
      description: "Romantic heart-shaped earrings adorned with sparkling diamonds."
    },
    { 
      id: 6, 
      name: "Diamond Ring", 
      price: 8999, 
      category: "rings",
      material: "Platinum, Premium Diamonds",
      weight: "10g",
      stock: 6,
      createdAt: new Date('2024-04-01'),
      description: "A magnificent diamond ring featuring a brilliant center stone."
    },
    { 
      id: 7, 
      name: "Diamond Stone and Gold Ring", 
      price: 7550, 
      category: "rings",
      material: "18K Yellow Gold, Diamond",
      weight: "9g",
      stock: 7,
      createdAt: new Date('2024-04-15'),
      description: "A sophisticated ring combining the brilliance of diamonds with gold."
    },
    { 
      id: 8, 
      name: "Distant Pearly Bracelet", 
      price: 2999, 
      category: "bracelets",
      material: "Sterling Silver, Cultured Pearls",
      weight: "10g",
      stock: 20,
      createdAt: new Date('2024-05-01'),
      description: "An elegant bracelet featuring pearls spaced along a delicate chain."
    },
    { 
      id: 9, 
      name: "Flat Pearls Bracelet", 
      price: 3499, 
      category: "bracelets",
      material: "Sterling Silver, Flat Cultured Pearls",
      weight: "11g",
      stock: 14,
      createdAt: new Date('2024-05-15'),
      description: "A modern take on the classic pearl bracelet."
    },
    { 
      id: 10, 
      name: "Gear Diamond & Gold Ring", 
      price: 6999, 
      category: "rings",
      material: "18K Gold, Diamonds",
      weight: "11g",
      stock: 9,
      createdAt: new Date('2024-06-01'),
      description: "An innovative ring design featuring gear-inspired elements."
    },
    { 
      id: 11, 
      name: "Gear Diamond & Gold Ring 2", 
      price: 7499, 
      category: "rings",
      material: "18K Gold, Premium Diamonds",
      weight: "12g",
      stock: 6,
      createdAt: new Date('2024-06-15'),
      description: "Enhanced diamond placement and refined gold work."
    },
    { 
      id: 12, 
      name: "Gear Diamond & Gold Ring 3", 
      price: 6500, 
      category: "rings",
      material: "18K Gold, Diamonds",
      weight: "10g",
      stock: 8,
      createdAt: new Date('2024-07-01'),
      description: "Latest in our gear-inspired collection with subtle mechanical aesthetic."
    },
    { 
      id: 13, 
      name: "Hooked Pearl & Gold Heart Earrings", 
      price: 4999, 
      category: "earrings",
      material: "18K Gold, Cultured Pearls",
      weight: "7g",
      stock: 11,
      createdAt: new Date('2024-07-15'),
      description: "Romantic earrings combining pearls with gold heart motifs."
    },
    { 
      id: 14, 
      name: "Heart Pearl Earrings", 
      price: 3950, 
      category: "earrings",
      material: "Sterling Silver, Cultured Pearls",
      weight: "5g",
      stock: 16,
      createdAt: new Date('2024-08-01'),
      description: "Delicate heart-shaped earrings adorned with lustrous pearls."
    },
    { 
      id: 15, 
      name: "Gold Floral Earrings", 
      price: 5599, 
      category: "earrings",
      material: "18K Yellow Gold",
      weight: "8g",
      stock: 10,
      createdAt: new Date('2024-08-15'),
      description: "Exquisite floral-inspired earrings with intricate botanical details."
    },
    { 
      id: 16, 
      name: "Gold Chained Earrings", 
      price: 4299, 
      category: "earrings",
      material: "18K Gold",
      weight: "6g",
      stock: 13,
      createdAt: new Date('2024-09-01'),
      description: "Modern chain-style earrings that move beautifully."
    },
    { 
      id: 17, 
      name: "Gold & Whitey Earrings", 
      price: 3200, 
      category: "earrings",
      material: "18K Gold, White Enamel",
      weight: "5g",
      stock: 18,
      createdAt: new Date('2024-09-15'),
      description: "Elegant earrings combining warm gold with crisp white accents."
    }
  ];

  // Search and filter products
  const searchProducts = (query, currentFilters, currentSort) => {
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      let results = [...allProducts];

      // Apply text search
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        results = results.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.material.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }

      // Apply filters
      if (currentFilters.category) {
        results = results.filter(product => product.category === currentFilters.category);
      }

      if (currentFilters.material) {
        results = results.filter(product => 
          product.material.toLowerCase().includes(currentFilters.material.toLowerCase())
        );
      }

      if (currentFilters.inStock) {
        results = results.filter(product => product.stock > 0);
      }

      // Apply price range
      results = results.filter(product => 
        product.price >= currentFilters.priceRange.min * 100 && 
        product.price <= currentFilters.priceRange.max * 100
      );

      // Apply sorting
      switch (currentSort) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'name':
        default:
          results.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  // Perform search when query, filters, or sort changes
  useEffect(() => {
    searchProducts(searchQuery, filters, sortBy);
  }, [searchQuery, filters, sortBy]);

  const updateFilter = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const updatePriceRange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: 0, max: 10000 },
      material: '',
      inStock: false,
    });
    setSearchQuery('');
    setSortBy('name');
  };

  const getFilteredProductCount = () => searchResults.length;

  const getAvailableCategories = () => {
    const categories = [...new Set(allProducts.map(p => p.category))];
    return categories.sort();
  };

  const getAvailableMaterials = () => {
    const materials = [...new Set(allProducts.flatMap(p => 
      p.material.split(', ').map(m => m.trim())
    ))];
    return materials.sort();
  };

  const getPriceRange = () => {
    const prices = allProducts.map(p => p.price / 100);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    updateFilter,
    updatePriceRange,
    sortBy,
    setSortBy,
    searchResults,
    isSearching,
    clearFilters,
    getFilteredProductCount,
    getAvailableCategories,
    getAvailableMaterials,
    getPriceRange,
    allProducts,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
