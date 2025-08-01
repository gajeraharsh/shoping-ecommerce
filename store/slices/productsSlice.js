import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/api/axiosConfig';
import { API_ENDPOINTS, buildQueryString } from '../../lib/api/endpoints';

// Async thunks for product API calls

// Get all products with filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_ENDPOINTS.PRODUCTS.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get featured products
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_FEATURED);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get new products
export const fetchNewProducts = createAsyncThunk(
  'products/fetchNewProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_NEW);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get trending products
export const fetchTrendingProducts = createAsyncThunk(
  'products/fetchTrendingProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_TRENDING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Search products
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchParams, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(searchParams);
      const url = `${API_ENDPOINTS.PRODUCTS.SEARCH}?${queryString}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get product by slug
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_BY_SLUG(slug));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categorySlug, params = {} }, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(params);
      const url = `${API_ENDPOINTS.PRODUCTS.GET_BY_CATEGORY(categorySlug)}${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get product filters
export const fetchProductFilters = createAsyncThunk(
  'products/fetchProductFilters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.GET_FILTERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mark product as viewed
export const markProductAsViewed = createAsyncThunk(
  'products/markProductAsViewed',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PRODUCTS.MARK_VIEWED(productId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    // Product lists
    allProducts: [],
    featuredProducts: [],
    newProducts: [],
    trendingProducts: [],
    searchResults: [],
    categoryProducts: [],
    
    // Single product
    currentProduct: null,
    
    // Filters and metadata
    filters: {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 10000 },
      sizes: [],
      colors: [],
    },
    
    // Pagination and search
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    },
    
    searchQuery: '',
    activeFilters: {},
    
    // Loading states
    loading: {
      products: false,
      featured: false,
      new: false,
      trending: false,
      search: false,
      single: false,
      category: false,
      filters: false,
    },
    
    // Error states
    error: {
      products: null,
      featured: null,
      new: null,
      trending: null,
      search: null,
      single: null,
      category: null,
      filters: null,
    },
  },
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType) {
        state.error[errorType] = null;
      } else {
        // Clear all errors
        Object.keys(state.error).forEach(key => {
          state.error[key] = null;
        });
      }
    },
    
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    // Set active filters
    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },
    
    // Update single filter
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.activeFilters[key] = value;
    },
    
    // Clear all filters
    clearFilters: (state) => {
      state.activeFilters = {};
      state.searchQuery = '';
    },
    
    // Set current product
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    
    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading.products = true;
        state.error.products = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading.products = false;
        state.allProducts = action.payload.data?.products || action.payload.products || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading.products = false;
        state.error.products = action.payload?.message || 'Failed to fetch products';
      })
      
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading.featured = true;
        state.error.featured = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featuredProducts = action.payload.data?.products || action.payload.products || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading.featured = false;
        state.error.featured = action.payload?.message || 'Failed to fetch featured products';
      })
      
      // Fetch new products
      .addCase(fetchNewProducts.pending, (state) => {
        state.loading.new = true;
        state.error.new = null;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.loading.new = false;
        state.newProducts = action.payload.data?.products || action.payload.products || [];
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.loading.new = false;
        state.error.new = action.payload?.message || 'Failed to fetch new products';
      })
      
      // Fetch trending products
      .addCase(fetchTrendingProducts.pending, (state) => {
        state.loading.trending = true;
        state.error.trending = null;
      })
      .addCase(fetchTrendingProducts.fulfilled, (state, action) => {
        state.loading.trending = false;
        state.trendingProducts = action.payload.data?.products || action.payload.products || [];
      })
      .addCase(fetchTrendingProducts.rejected, (state, action) => {
        state.loading.trending = false;
        state.error.trending = action.payload?.message || 'Failed to fetch trending products';
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.data?.products || action.payload.products || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload?.message || 'Failed to search products';
      })
      
      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading.single = false;
        state.currentProduct = action.payload.data?.product || action.payload.product || action.payload.data;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading.single = false;
        state.error.single = action.payload?.message || 'Failed to fetch product';
      })
      
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading.category = true;
        state.error.category = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading.category = false;
        state.categoryProducts = action.payload.data?.products || action.payload.products || [];
        if (action.payload.data?.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading.category = false;
        state.error.category = action.payload?.message || 'Failed to fetch category products';
      })
      
      // Fetch product filters
      .addCase(fetchProductFilters.pending, (state) => {
        state.loading.filters = true;
        state.error.filters = null;
      })
      .addCase(fetchProductFilters.fulfilled, (state, action) => {
        state.loading.filters = false;
        state.filters = action.payload.data?.filters || action.payload.filters || action.payload.data || state.filters;
      })
      .addCase(fetchProductFilters.rejected, (state, action) => {
        state.loading.filters = false;
        state.error.filters = action.payload?.message || 'Failed to fetch filters';
      });
  },
});

export const {
  clearError,
  setSearchQuery,
  setActiveFilters,
  updateFilter,
  clearFilters,
  setCurrentProduct,
  clearCurrentProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
