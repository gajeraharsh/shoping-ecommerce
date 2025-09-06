'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { requestPasswordReset } from '@/services/modules/auth/authService'
// Rely on global API interceptor for success/error toasts

export default function ForgotPasswordClient() {
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Enter your email to receive a reset link</p>
            </div>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setLoading(true)
                try {
                  await requestPasswordReset(values.email)
                  // Success handled by interceptor
                  resetForm()
                } catch (err) {
                  // handled by interceptor
                } finally {
                  setLoading(false)
                  setSubmitting(false)
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm sm:text-base min-h-[48px] ${touched.email && errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {touched.email && errors.email && (
                      <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting || !isValid}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-3 sm:py-4 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] text-sm sm:text-base"
                  >
                    {loading || isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              )}
            </Formik>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Remembered your password?{' '}
                <Link href="/auth/login" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 touch-manipulation">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
