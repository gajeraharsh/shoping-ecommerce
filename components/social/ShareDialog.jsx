"use client"

import { useEffect, useState } from "react"
import { X, Share2, Copy, Mail, Send, MessageCircle, Globe, Link as LinkIcon } from "lucide-react"

export default function ShareDialog({ open, onClose, url, title = "Check this out" }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => { if (!open) setCopied(false) }, [open])

  const encodedUrl = encodeURIComponent(url || "")
  const encodedTitle = encodeURIComponent(title || "")
  const supportsShare = typeof navigator !== 'undefined' && !!navigator.share
  const items = [
    { key: 'wa', name: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, icon: MessageCircle },
    { key: 'fb', name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Globe },
    { key: 'x', name: 'Twitter/X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, icon: Share2 },
    { key: 'li', name: 'LinkedIn', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, icon: Globe },
    { key: 'tg', name: 'Telegram', href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, icon: Send },
    { key: 'rd', name: 'Reddit', href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: Globe },
    { key: 'gm', name: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedTitle}&body=${encodedUrl}`, icon: Mail },
    { key: 'em', name: 'Email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: Mail },
  ]

  if (!open) return null

  const openWindow = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=800,height=600')
  }

  const tryNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        onClose?.()
        return
      }
    } catch {}
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url || "")
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[520px] bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Share</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* URL box */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 text-xs sm:text-sm border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
            {url}
          </div>
          <button onClick={handleCopy} className="h-9 px-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
            <Copy size={16} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Grid of platforms */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {supportsShare && (
            <button
              onClick={tryNativeShare}
              className="group border rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-center flex flex-col items-center justify-center gap-2 min-h-[100px]"
            >
              <div className="h-10 w-10 rounded-full grid place-items-center border bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                <Share2 size={16} />
              </div>
              <div className="text-xs font-medium line-clamp-1">Share via device</div>
            </button>
          )}
          {items.map((it) => {
            const Icon = it.icon || Globe
            return (
              <button
                key={it.key}
                onClick={() => openWindow(it.href)}
                className="group border rounded-xl p-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-center flex flex-col items-center justify-center gap-2 min-h-[100px]"
              >
                <div className="h-10 w-10 rounded-full grid place-items-center border bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
                  <Icon size={18} />
                </div>
                <div className="text-xs font-medium line-clamp-1">{it.name}</div>
              </button>
            )
          })}
          <button
            onClick={handleCopy}
            className="group border rounded-xl px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-center"
          >
            <div className="mx-auto mb-2 h-9 w-9 rounded-full grid place-items-center border bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
              <LinkIcon size={16} />
            </div>
            <div className="text-xs font-medium line-clamp-1">{copied ? 'Copied!' : 'Copy link'}</div>
          </button>
        </div>
      </div>
    </div>
  )
}
