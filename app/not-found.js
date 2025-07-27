import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/products"
              className="inline-block border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}