import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight, Shield, Award } from 'lucide-react';
import { BRAND, getSocialLinks, getContactInfo, getTrustIndicators } from '@/lib/brand';
import PaymentLogos from '@/components/common/PaymentLogos';

export default function Footer() {
  const socials = getSocialLinks();
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Stay in Style</h3>
              <p className="text-gray-400 text-base sm:text-lg">
                Subscribe to our newsletter for exclusive access to new collections, styling tips, and special offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm sm:text-base min-h-[48px]"
              />
              <button className="bg-white text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center group touch-manipulation min-h-[48px] text-sm sm:text-base">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-lg sm:text-xl shadow-lg">
                M
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold tracking-tight">{BRAND.name}</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {BRAND.description}
            </p>
            <div className="mb-4 sm:mb-6">
              <p className="text-sm font-medium text-gray-300 mb-2">Follow our journey</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>{getTrustIndicators().customers} Happy Customers</span>
                <span className="mx-2">•</span>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Premium Quality Guaranteed</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href={socials.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors w-11 h-11 rounded-full hover:bg-gray-800 flex items-center justify-center touch-manipulation">
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href={socials.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors w-11 h-11 rounded-full hover:bg-gray-800 flex items-center justify-center touch-manipulation">
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a href={socials.twitter} aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors w-11 h-11 rounded-full hover:bg-gray-800 flex items-center justify-center touch-manipulation">
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Shop</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">All Collections</Link></li>
              <li><Link href="/products?sort=newest" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">New Arrivals</Link></li>
              <li><Link href="/products?sale=true" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Sale</Link></li>
              <li><Link href="/products?category=bestsellers" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Bestsellers</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Wishlist</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">Size Guide</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">FAQ</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base touch-manipulation block py-1">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-sm sm:text-base">{getContactInfo().email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white text-sm sm:text-base">{getContactInfo().phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-sm sm:text-base leading-relaxed">{getContactInfo().address.full}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Certifications */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Trusted by Thousands of Customers</h3>
            <div className="flex flex-wrap gap-3 sm:gap-2 justify-center mb-4 sm:mb-6">
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                <Shield className="h-3 w-3 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              <span className="text-xs sm:text-sm text-gray-300">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
              <span className="text-xs sm:text-sm text-gray-300">PCI Compliant</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-300 text-center">
              Better Business Bureau A+ Rating
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center mb-4">
            <h4 className="text-sm sm:text-base font-semibold text-white">We Accept</h4>
          </div>
          <PaymentLogos />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © 2024 {BRAND.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation py-1">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation py-1">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation py-1">
                Cookie Policy
              </Link>
              <Link href="/shipping" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation py-1">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors touch-manipulation py-1">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
