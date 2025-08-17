'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { login as loginApi } from '@/services/modules/auth/authService';
import { Eye, EyeOff } from 'lucide-react';
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const toast = useToast();
  
  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      toast.success('Your email has been verified. You can log in now.');
    }
  }, [searchParams, toast]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Login</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back to Modave</p>
            </div>
            
            <Formik
              initialValues={{ email: '', password: '', remember: false }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setLoading(true);
                try {
                  await loginApi({ email: values.email, password: values.password });
                  router.push(redirect);
                } catch (err) {
                  // handled by interceptor
                } finally {
                  setLoading(false);
                  setSubmitting(false);
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

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent pr-12 text-sm sm:text-base min-h-[48px] ${touched.password && errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter your password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 w-10 h-10 flex items-center justify-center touch-manipulation"
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

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center">
                      <input id="remember" name="remember" type="checkbox" className={`h-4 w-4 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-600 rounded`} checked={values.remember} onChange={handleChange} onBlur={handleBlur} />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 select-none">Remember me</label>
                    </div>

                    <div className="text-sm">
                      <Link href="/auth/forgot-password" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 touch-manipulation block py-1">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <button type="submit" disabled={loading || isSubmitting || !isValid} className="w-full bg-black dark:bg-white text-white dark:text-black py-3 sm:py-4 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[48px] text-sm sm:text-base">
                    {loading || isSubmitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              )}
            </Formik>

            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 touch-manipulation">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
