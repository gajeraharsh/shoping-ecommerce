// /services/utils/authStorage.js
export function setAuth({ token, user }) {
  if (typeof window === 'undefined') return
  try {
    if (token) localStorage.setItem('token', token)
    if (user) localStorage.setItem('user', JSON.stringify(user))
  } catch (_) {}
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (_) {}
}

export function getToken() {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('token')
  } catch (_) {
    return null
  }
}

export function getUser() {
  if (typeof window === 'undefined') return null
  try {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  } catch (_) {
    return null
  }
}
