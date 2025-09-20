'use client'

import Link from 'next/link'
import { BRAND, getSocialLinks } from '@/lib/brand'
import FooterNewsletterForm from '@/components/layout/FooterNewsletterForm'

export default function Footer() {
  const socials = getSocialLinks()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-white dark:bg-white dark:text-black">
      {/* Newsletter band */}
      <div className="border-b border-white/10 dark:border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-light tracking-tight">Join our newsletter</h3>
              <p className="mt-2 text-sm sm:text-base text-white/70 dark:text-black/70">
                Be first to know about new drops, exclusive offers and style stories.
              </p>
            </div>
            <div>
              <FooterNewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="text-xl font-semibold">{BRAND.name}</div>
            <p className="text-sm text-white/70 dark:text-black/70 max-w-xs">{BRAND.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-black/80">
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-black/80">
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:underline">Shipping</Link></li>
              <li><Link href="/returns" className="hover:underline">Returns</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Follow</h4>
            <ul className="space-y-2 text-sm text-white/80 dark:text-black/80">
              {socials.instagram && (
                <li><a href={socials.instagram} target="_blank" rel="noopener" className="hover:underline">Instagram</a></li>
              )}
              {socials.facebook && (
                <li><a href={socials.facebook} target="_blank" rel="noopener" className="hover:underline">Facebook</a></li>
              )}
              {socials.youtube && (
                <li><a href={socials.youtube} target="_blank" rel="noopener" className="hover:underline">YouTube</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 dark:border-black/10 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 dark:text-black/60">© {year} {BRAND.name}. All rights reserved.</p>
          <p className="text-white/60 dark:text-black/60">Made in Gujarat, India</p>
        </div>
      </div>
    </footer>
  )
}
