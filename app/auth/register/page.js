'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { register as registerApi } from '@/services/modules/auth/authService';
import { Eye, EyeOff } from 'lucide-react';
import { Formik } from 'formik';
import * as Yup from 'yup';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  // Password visibility + loading state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If email is provided via query (e.g., returning from verify), prefill it
  useEffect(() => {
    const email = searchParams?.get('email') || '';
    if (email) {
      // Prefetch verify page to make navigation instant
      router.prefetch(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
  }, [searchParams, router]);

  // Validation schema (Formik + Yup)
  const validationSchema = Yup.object({
    first_name: Yup.string().max(50, 'Too long').required('First name is required'),
    last_name: Yup.string().max(50, 'Too long').required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'At least 8 characters')
      .matches(/[a-z]/, 'At least one lowercase letter')
      .matches(/[A-Z]/, 'At least one uppercase letter')
      .matches(/[0-9]/, 'At least one number')
      .matches(/[^A-Za-z0-9]/, 'At least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
    agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms')
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-fluid section-padding-sm">
        <div className="max-w-md mx-auto">
          <div className="card-minimal p-8">
            <div className="text-center mb-8">
              <h1 className="heading-md text-gray-900 dark:text-white mb-2">Create Account</h1>
              <p className="body-base text-fade">Join the Faxio community</p>
            </div>
            
            <Formik
              enableReinitialize
              initialValues={{
                first_name: '',
                last_name: '',
                email: searchParams?.get('email') || '',
                password: '',
                confirmPassword: '',
                agreeTerms: false,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                try {
                  await registerApi({
                    email: values.email,
                    password: values.password,
                    first_name: values.first_name || undefined,
                    last_name: values.last_name || undefined,
                  });
                  const relative = `/auth/verify-otp?email=${encodeURIComponent(values.email)}`;
                  const nextUrl = typeof window !== 'undefined' ? `${window.location.origin}${relative}` : relative;
                  if (typeof window !== 'undefined') {
                    // eslint-disable-next-line no-console
                    console.debug('[register] redirecting to', nextUrl);
                    window.location.replace(nextUrl);
                  } else {
                    router.replace(nextUrl);
                  }
                } catch (err) {
                  // Error toasts handled by interceptor
                } finally {
                  setLoading(false);
                  setSubmitting(false);
                }
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${touched.first_name && errors.first_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter first name"
                      />
                      {touched.first_name && errors.first_name && (
                        <div className="mt-1 text-sm text-red-600">{errors.first_name}</div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${touched.last_name && errors.last_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter last name"
                      />
                      {touched.last_name && errors.last_name && (
                        <div className="mt-1 text-sm text-red-600">{errors.last_name}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${touched.email && errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {touched.email && errors.email && (
                      <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white pr-12 ${touched.password && errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Create a password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 w-10 h-10 flex items-center justify-center"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {touched.password && errors.password && (
                      <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Confirm your password"
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <div className="mt-1 text-sm text-red-600">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={values.agreeTerms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-600 rounded ${touched.agreeTerms && errors.agreeTerms ? 'border-red-500 ring-red-500' : ''}`}
                    />
                    <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link href="/terms" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {touched.agreeTerms && errors.agreeTerms && (
                    <div className="mt-1 text-sm text-red-600">{errors.agreeTerms}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || isSubmitting || !isValid}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading || isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </Formik>

            <div className="mt-8 text-center">
              <p className="body-base text-fade">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-700 dark:text-gray-200">Loading…</div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  )
}
