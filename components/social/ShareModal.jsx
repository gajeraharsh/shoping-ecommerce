'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy } from 'lucide-react'

export default function ShareModal({ title = 'Share', url: incomingUrl, onClose }) {
  const [copied, setCopied] = useState(false)

  const url = useMemo(() => {
    if (incomingUrl) return incomingUrl
    if (typeof window !== 'undefined') return window.location.href
    return ''
  }, [incomingUrl])

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      }
      setCopied(true)
    } catch (_) {
      setCopied(false)
    }
  }

  const shareTargets = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    },
  ]

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-xl w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Share link</label>
          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100"
            />
            <button
              onClick={copy}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50"
            >
              <span className="inline-flex items-center gap-2 text-sm"><Copy size={16} /> {copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick share</div>
          <div className="flex flex-wrap gap-2">
            {shareTargets.map(t => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 text-sm"
              >
                {t.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
