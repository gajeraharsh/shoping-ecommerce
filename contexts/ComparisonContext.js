'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState([]);
  const maxCompareItems = 4;

  // Load comparison data from localStorage on component mount
  useEffect(() => {
    const savedCompareProducts = localStorage.getItem('compareProducts');
    if (savedCompareProducts) {
      setCompareProducts(JSON.parse(savedCompareProducts));
    }
  }, []);

  // Save to localStorage whenever compareProducts changes
  useEffect(() => {
    localStorage.setItem('compareProducts', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const addToComparison = (product) => {
    setCompareProducts(prev => {
      // Check if product is already in comparison
      if (prev.find(p => p.id === product.id)) {
        return prev;
      }
      
      // If we've reached the max limit, remove the first item
      if (prev.length >= maxCompareItems) {
        return [...prev.slice(1), product];
      }
      
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearComparison = () => {
    setCompareProducts([]);
  };

  const isInComparison = (productId) => {
    return compareProducts.some(p => p.id === productId);
  };

  const getComparisonCount = () => {
    return compareProducts.length;
  };

  const canAddMore = () => {
    return compareProducts.length < maxCompareItems;
  };

  const value = {
    compareProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    getComparisonCount,
    canAddMore,
    maxCompareItems
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};
