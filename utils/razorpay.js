// utils/razorpay.js
let scriptPromise = null

export function loadRazorpay() {
  if (typeof window === 'undefined') return Promise.reject(new Error('window not available'))
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existing) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load Razorpay script'))
    document.body.appendChild(script)
  })
  return scriptPromise
}
