import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight, Shield, Award } from 'lucide-react';
import { BRAND, getSocialLinks, getContactInfo, getTrustIndicators } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Stay in Style</h3>
              <p className="text-gray-400 text-lg">
                Subscribe to our newsletter for exclusive access to new collections, styling tips, and special offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center group">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black px-4 py-2 rounded-xl font-bold text-xl shadow-lg">
                M
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight">{BRAND.name}</span>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">{BRAND.tagline}</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {BRAND.description}
            </p>
            <div className="mb-6">
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Collections</Link></li>
              <li><Link href="/products?sort=newest" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?sale=true" className="text-gray-400 hover:text-white transition-colors">Sale</Link></li>
              <li><Link href="/products?category=bestsellers" className="text-gray-400 hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white">{getContactInfo().email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white">{getContactInfo().phone}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Address</p>
                  <p className="text-white">{getContactInfo().address.full}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Certifications */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Trusted by Thousands of Customers</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="h-3 w-3 text-green-600" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>PCI Compliant</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-gray-300">PCI Compliant</span>
            </div>
            <div className="text-sm text-gray-300">
              Better Business Bureau A+ Rating
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 {BRAND.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
              <Link href="/shipping" className="text-gray-400 hover:text-white text-sm transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-gray-400 hover:text-white text-sm transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
