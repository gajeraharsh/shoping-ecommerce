"use client"

import { useEffect } from "react"

export default function ShareDialog({ open, onClose, url, title = "Check this out" }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const items = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: 'Twitter/X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}` },
    { name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { name: 'Reddit', href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` },
    { name: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedTitle}&body=${encodedUrl}` },
    { name: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}` },
  ]

  const openWindow = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=800,height=600')
  }

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[480px] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Share</h3>
          <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">Close</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it) => (
            <button key={it.name} onClick={() => openWindow(it.href)} className="border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left">
              {it.name}
            </button>
          ))}
          <button
            onClick={async () => { try { await navigator.clipboard.writeText(url) } catch {} onClose?.() }}
            className="border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-left"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  )
}
