'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { verifyOtp, register as registerApi } from '@/services/modules/auth/authService'
import { useToast } from '@/hooks/useToast'

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otp, setOtp] = useState(Array(6).fill(''))
  const inputsRef = useRef([])

  useEffect(() => {
    const e = searchParams.get('email')
    if (e) setEmail(e)
  }, [searchParams])

  // Countdown for resend button
  useEffect(() => {
    if (!resendTimer) return
    const t = setInterval(() => {
      setResendTimer((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(t)
  }, [resendTimer])

  const maskedEmail = useMemo(() => {
    if (!email) return ''
    const [user, domain] = email.split('@')
    if (!domain) return email
    const u = user.length > 2 ? `${user[0]}${'*'.repeat(Math.max(user.length - 2, 1))}${user[user.length - 1]}` : `${user[0]}*`
    return `${u}@${domain}`
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const joined = otp.join('')
    if (!email || joined.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }
    setLoading(true)
    try {
      await verifyOtp({ email, code: joined })
      // Success toast is handled by interceptor via meta.successMessage
      // Redirect to login with hint
      router.push('/auth/login?verified=1')
    } catch (err) {
      // Error toast handled globally
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error('Please enter your email to resend the code')
      return
    }
    if (resendTimer > 0) return
    try {
      await registerApi({ email })
      setResendTimer(30)
      // Interceptor will show "OTP sent" toast
    } catch (e) {
      // Error toast handled globally
    }
  }

  // OTP input handlers
  const handleOtpChange = (value, index) => {
    const v = value.replace(/\D/g, '')
    // If empty, just clear this cell
    if (!v) {
      const next = [...otp]
      next[index] = ''
      setOtp(next)
      return
    }
    // Fill current and subsequent cells with typed/pasted digits
    const chars = v.split('')
    const next = [...otp]
    let i = index
    for (const ch of chars) {
      if (i > 5) break
      next[i] = ch
      i += 1
    }
    setOtp(next)
    const nextIndex = Math.min(i, 5)
    inputsRef.current[nextIndex]?.focus()
  }

  const handleOtpKeyDown = (e, index) => {
    const key = e.key
    if (key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp]
        next[index] = ''
        setOtp(next)
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus()
        const next = [...otp]
        next[index - 1] = ''
        setOtp(next)
      }
      e.preventDefault()
    } else if (key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
      e.preventDefault()
    } else if (key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus()
      e.preventDefault()
    }
  }

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!paste) return
    const chars = paste.slice(0, 6).split('')
    const next = Array(6).fill('')
    for (let i = 0; i < chars.length; i++) next[i] = chars[i]
    setOtp(next)
    inputsRef.current[Math.min(chars.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-fluid section-padding-sm">
        <div className="max-w-md mx-auto">
          <div className="card-minimal p-8">
            <div className="text-center mb-8">
              <h1 className="heading-md text-gray-900 dark:text-white mb-2">Verify your email</h1>
              <p className="body-base text-fade">We sent a 6-digit code to {maskedEmail || 'your email'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" onPaste={handleOtpPaste}>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    disabled
                    aria-readonly="true"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl cursor-not-allowed opacity-80"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verification code
                    </label>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimer > 0}
                      className="text-sm font-medium text-gray-900 dark:text-white disabled:text-gray-400 dark:disabled:text-gray-600"
                      aria-disabled={resendTimer > 0}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {otp.map((val, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                        aria-label={`Digit ${i + 1}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Enter the 6-digit code</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Verify email'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="body-base text-fade">
                Wrong email?{' '}
                <Link href={`/auth/register${email ? `?email=${encodeURIComponent(email)}` : ''}`} className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                  Change it
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-700 dark:text-gray-200">Loading…</div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  )
}
