'use client'

import { useState } from 'react'
import { subscribeNewsletter } from '@/services/modules/newsletter/newsletterService'
import { useToast } from '@/hooks/useToast'

export default function BlogSidebarNewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await subscribeNewsletter(email)
      setEmail('')
      showToast("You're subscribed to the newsletter!", 'success')
    } catch (_) {
      try {
        const msg = _?.response?.data?.message || _?.message || ''
        if (/unique|already|exists|duplicate/i.test(msg)) {
          showToast('You are already subscribed.', 'info')
        } else {
          showToast('Subscription failed. Please try again.', 'error')
        }
      } catch {
        showToast('Subscription failed. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite">
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg text-gray-900 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
