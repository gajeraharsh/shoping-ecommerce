import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-white px-3 py-1 rounded-lg font-bold text-lg sm:text-xl">
                F
              </div>
              <span className="text-lg sm:text-xl font-bold">Fashionista</span>
            </div>
            <p className="text-gray-400 dark:text-gray-300 mb-4 text-sm sm:text-base">
              Your destination for premium fashion. Discover the latest trends and timeless classics.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 dark:text-gray-300 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 dark:text-gray-300 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 dark:text-gray-300 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="/products" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">All Products</Link></li>
              <li><Link href="/products?category=kurtis" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Kurtis</Link></li>
              <li><Link href="/products?category=dresses" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Dresses</Link></li>
              <li><Link href="/products?category=ethnic" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Ethnic Wear</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Customer Service</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link href="/contact" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Returns</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm sm:text-base transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 dark:text-gray-300 text-sm sm:text-base">support@fashionista.com</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 dark:text-gray-300 text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400 dark:text-gray-300 text-sm sm:text-base">123 Fashion St, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Fashionista. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
