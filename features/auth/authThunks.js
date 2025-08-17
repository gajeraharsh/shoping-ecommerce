// /features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import { login, register, verifyOtp, logout } from '@/services/modules/auth/authService'

function persistAuth({ token, user }) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem('token', token)
  if (user) localStorage.setItem('user', JSON.stringify(user))
}

function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ credentials, provider = 'emailpass' }, { rejectWithValue }) => {
    try {
      const res = await login(credentials, provider)
      // Expect backend to return a token string or { token, user }
      const isStringToken = typeof res === 'string'
      const payload = {
        token: isStringToken ? res : res?.token || res?.access_token || res?.data?.token || null,
        user: res?.user || res?.data?.user || null,
      }
      persistAuth(payload)
      return payload
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await register(userData)
      return res
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)

export const verifyOtpUser = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await verifyOtp(payload)
      // Some flows may also return token+user after verification
      const result = {
        token: res?.token || res?.access_token || res?.data?.token || null,
        user: res?.user || res?.data?.user || null,
      }
      if (result.token) persistAuth(result)
      return res
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout()
      clearAuth()
      return true
    } catch (err) {
      // Even if API fails, clear local auth to avoid stuck sessions
      clearAuth()
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)
