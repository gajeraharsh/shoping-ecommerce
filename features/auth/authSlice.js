// /features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { loginUser, registerUser, verifyOtpUser, logoutUser } from './authThunks'

let persistedToken = null
let persistedUser = null
if (typeof window !== 'undefined') {
  try {
    persistedToken = localStorage.getItem('token') || null
    const userStr = localStorage.getItem('user')
    persistedUser = userStr ? JSON.parse(userStr) : null
  } catch (_) {}
}

const initialState = {
  token: persistedToken,
  user: persistedUser,
  isAuthenticated: !!persistedToken,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {}
      state.token = token || null
      state.user = user || null
      state.isAuthenticated = !!token
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('token', token)
        if (user) localStorage.setItem('user', JSON.stringify(user))
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        const { token, user } = action.payload || {}
        state.token = token || null
        state.user = user || null
        state.isAuthenticated = !!token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Login failed'
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Register failed'
      })
      // Verify OTP
      .addCase(verifyOtpUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtpUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(verifyOtpUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Verification failed'
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { setCredentials } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectAuth = (state) => state.auth
export const selectToken = (state) => state.auth.token
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
