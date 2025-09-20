// /features/collection/collectionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCollections } from '@/services/modules/collection/collectionService'

export const fetchCollections = createAsyncThunk(
  'collection/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch a large page to keep things simple; adjust if needed
      const res = await getCollections({ limit: 200 })
      const list = Array.isArray(res?.collections) ? res.collections : (Array.isArray(res) ? res : [])
      return list
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to load collections')
    }
  }
)

const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    items: [], // [{ id, title, handle }]
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const raw = Array.isArray(action.payload) ? action.payload : []
        // Normalize minimal fields used in UI
        state.items = raw.map((c) => ({
          id: c.id,
          title: c.title || c.name || c.handle || c.id,
          handle: c.handle || null,
        }))
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load collections'
      })
  },
})

export default collectionSlice.reducer
