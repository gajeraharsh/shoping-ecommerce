'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { resetPassword } from '@/services/modules/auth/authService'

export default function ResetPasswordClient() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const urlToken = searchParams.get('token') || ''
  const hasToken = !!urlToken

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm your password'),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Enter your new password</p>
            </div>
            {!hasToken && (
              <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-200 p-3 text-sm">
                Missing or invalid reset link. Please use the link from your email or request a new one on the Forgot Password page.
              </div>
            )}

            <Formik
              enableReinitialize
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true)
                try {
                  await resetPassword({ token: urlToken, password: values.password })
                  // Global interceptor shows success
                  router.push('/auth/login')
                } catch (err) {
                  // handled globally
                } finally {
                  setLoading(false)
                  setSubmitting(false)
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Token field removed: token is read from URL search params */}

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm sm:text-base min-h-[48px] ${touched.password && errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter new password"
                    />
                    {touched.password && errors.password && (
                      <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm sm:text-base min-h-[48px] ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Re-enter new password"
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="mt-1 text-sm text-red-600">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!hasToken || loading || isSubmitting || !isValid}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-3 sm:py-4 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] text-sm sm:text-base"
                  >
                    {loading || isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </Formik>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Back to{' '}
                <Link href="/auth/login" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 touch-manipulation">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
