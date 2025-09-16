'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { subscribeNewsletter } from '@/services/modules/newsletter/newsletterService'
import { useToast } from '@/hooks/useToast'

export default function HomeNewsletterForm() {
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
    <div className="w-full" aria-live="polite">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="flex-1 px-6 py-4 sm:px-8 sm:py-5 rounded-full text-black bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white text-sm sm:text-base min-h-[48px] touch-manipulation font-medium placeholder:text-gray-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white dark:text-black px-8 py-4 sm:px-10 sm:py-5 rounded-full font-medium hover:bg-white/20 hover:border-white/30 transition-colors duration-300 text-sm sm:text-base min-h-[48px] touch-manipulation group"
        >
          <span>{loading ? 'Subscribing…' : 'Subscribe'}</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 inline" />
        </button>
      </form>
    </div>
  )
}
