'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { subscribeNewsletter } from '@/services/modules/newsletter/newsletterService'
import { useToast } from '@/hooks/useToast'

export default function FooterNewsletterForm() {
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
      // Show info if already subscribed, else generic error
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
    <div className="w-full">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full" aria-live="polite">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm sm:text-base min-h-[48px]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center group touch-manipulation min-h-[48px] text-sm sm:text-base"
        >
          {loading ? 'Subscribing…' : 'Subscribe'}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  )
}
