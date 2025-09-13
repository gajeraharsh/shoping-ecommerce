// /features/category/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getCategoryTree } from '@/services/modules/category/categoryService'

export const fetchCategoryTree = createAsyncThunk(
  'category/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const tree = await getCategoryTree()
      return tree
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to load categories')
    }
  }
)

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryTree.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Transform Medusa categories (with category_children) into UI-friendly tree
        const sortCats = (arr = []) =>
          [...arr].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0) || a.name.localeCompare(b.name))

        const toNode = (c) => ({
          id: c.id,
          name: c.name,
          slug: c.handle || c.id,
          // Preserve metadata and common media fields for downstream UI needs (e.g., home categories)
          metadata: c.metadata || c.meta || {},
          thumbnail: c.thumbnail || c.image || c.preview_image || null,
          children: sortCats(
            Array.isArray(c.category_children)
              ? c.category_children
              : Array.isArray(c.children)
                ? c.children
                : []
          ).map(toNode),
        })

        const raw = Array.isArray(action.payload) ? action.payload : []
        // Only keep root categories as top-level; Medusa list may include children as separate items too
        const roots = raw.filter((c) => !c.parent_category_id)
        state.items = sortCats(roots).map(toNode)
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to load categories'
      })
  },
})

export default categorySlice.reducer
