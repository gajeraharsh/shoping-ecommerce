// /features/auth/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit'
import { login, register, verifyOtp, logout } from '@/services/modules/auth/authService'
import { getMe } from '@/services/modules/customer/customerService'
import { setAuth as setAuthStorage, clearAuth as clearAuthStorage } from '@/services/utils/authStorage'

// Use centralized storage helpers to avoid direct localStorage usage here

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ credentials, provider = 'emailpass' }, { rejectWithValue, dispatch }) => {
    try {
      const res = await login(credentials, provider)
      // Expect backend to return a token string or { token, user }
      const isStringToken = typeof res === 'string'
      const payload = {
        token: isStringToken ? res : res?.token || res?.access_token || res?.data?.token || null,
        user: res?.user || res?.data?.user || null,
      }
      setAuthStorage(payload)
      // After token is saved, fetch profile
      try {
        await dispatch(fetchMeUser()).unwrap()
      } catch (_) {}
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
      if (result.token) setAuthStorage(result)
      return res
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)

export const fetchMeUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMe()
      // Persist user via centralized storage helper
      if (res) setAuthStorage({ user: res })
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
      clearAuthStorage()
      return true
    } catch (err) {
      // Even if API fails, clear local auth to avoid stuck sessions
      clearAuthStorage()
      return rejectWithValue(err?.response?.data?.message || err.message)
    }
  }
)
