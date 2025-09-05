'use client'

import { useEffect, useState } from 'react'

type TikTokVideo = {
  id: string
  title?: string
  create_time?: number
  statistics?: {
    view_count?: number
    like_count?: number
    comment_count?: number
    share_count?: number
  }
}

type ApiResult = {
  cursor: number
  has_more: boolean
  videos: TikTokVideo[]
}

async function fetchPage(cursor = 0, max = 20): Promise<ApiResult> {
  const r = await fetch('/api/videos', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cursor, max_count: max }),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(j?.error || j?.details?.message || 'Failed to fetch videos')
  return j as ApiResult
}

function fmtDate(ts?: number) {
  if (!ts) return '-'
  try {
    const d = new Date(ts * 1000)
    return d.toLocaleDateString()
  } catch {
    return '-'
  }
}

function fmt(n?: number) {
  return Number(n ?? 0).toLocaleString()
}

export function PerVideoBreakdown() {
  // Runtime flag (no rebuilds needed)
  const [enabled, setEnabled] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [items, setItems] = useState<TikTokVideo[]>([])
  const [cursor, setCursor] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [loadedOnce, setLoadedOnce] = useState(false)

  // Fetch flag once on mount
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const r = await fetch('/api/flags/per-video', { cache: 'no-store' })
        const j = await r.json().catch(() => ({}))
        if (!alive) return
        setEnabled(!!j.enabled)
      } catch {
        if (!alive) return
        setEnabled(false)
      }
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!enabled || !open || loadedOnce) return
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const j = await fetchPage(0, 20)
        setItems(Array.isArray(j.videos) ? j.videos : [])
        setCursor(Number(j.cursor ?? 0))
        setHasMore(!!j.has_more)
      } catch (e: any) {
        setError(e?.message || String(e))
      } finally {
        setLoading(false)
        setLoadedOnce(true)
      }
    })()
  }, [open, enabled, loadedOnce])

  const onLoadMore = async () => {
    setLoading(true)
    setError('')
    try {
      const j = await fetchPage(cursor, 20)
      setItems(prev => [...prev, ...(Array.isArray(j.videos) ? j.videos : [])])
      setCursor(Number(j.cursor ?? 0))
      setHasMore(!!j.has_more)
    } catch (e: any) {
      setError(e?.message || String(e))
    } finally {
      setLoading(false)
    }
  }

  // While flag is loading, render nothing to avoid flicker
  if (enabled === null) return null
  if (!enabled) return null

  return (
    <div className="mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-gray-800/60 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-gray-200">Per-video breakdown</span>
        <svg className={`w-4 h-4 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.188l3.71-3.96a.75.75 0 111.08 1.04l-4.24 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 p-3 bg-gray-900/40 border border-gray-800 rounded-lg">
          {loading && items.length === 0 && (
            <div className="text-center text-gray-400 text-sm">Loading videos…</div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-md p-2 mb-2 text-red-300 text-sm">{error}</div>
          )}

          {!loading && !error && items.length === 0 && loadedOnce && (
            <div className="text-gray-400 text-sm">No videos found.</div>
          )}

          {items.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="py-2 pr-4 font-medium">ID</th>
                    <th className="py-2 pr-4 font-medium">Title</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                    <th className="py-2 pr-4 font-medium">Views</th>
                    <th className="py-2 pr-4 font-medium">Likes</th>
                    <th className="py-2 pr-4 font-medium">Comments</th>
                    <th className="py-2 pr-0 font-medium">Shares</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(v => (
                    <tr key={v.id} className="border-t border-gray-800 text-gray-200">
                      <td className="py-2 pr-4 align-top whitespace-nowrap text-xs text-gray-400">{v.id}</td>
                      <td className="py-2 pr-4 align-top">{v.title || '-'}</td>
                      <td className="py-2 pr-4 align-top whitespace-nowrap">{fmtDate(v.create_time)}</td>
                      <td className="py-2 pr-4 align-top">{fmt(v.statistics?.view_count)}</td>
                      <td className="py-2 pr-4 align-top">{fmt(v.statistics?.like_count)}</td>
                      <td className="py-2 pr-4 align-top">{fmt(v.statistics?.comment_count)}</td>
                      <td className="py-2 pr-0 align-top">{fmt(v.statistics?.share_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hasMore && (
            <div className="mt-3">
              <button onClick={onLoadMore} className="btn-secondary w-full" disabled={loading}>
                {loading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
