import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../lib/api/axiosConfig';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    
    // Check if we've already called this API
    if (state.categories.callTracker) {
      console.log('Categories already fetched, skipping API call');
      return { skipCall: true };
    }
    
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Categories slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    callTracker: false, // Track if API has been called
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.callTracker = true; // Mark as called
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Handle skipCall case - don't update data if it was skipped
        if (!action.payload.skipCall) {
          state.categories = action.payload.data?.categories || action.payload.categories || action.payload.data || [];
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch categories';
      });
  },
});

export const { clearError } = categoriesSlice.actions;

export default categoriesSlice.reducer;
