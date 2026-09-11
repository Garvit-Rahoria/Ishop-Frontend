'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const Pagination = ({ page = 1, pages = 0 }) => {
    const searchParams = useSearchParams()
    const current = Number(page) || 1
    const totalPages = Number(pages) || 0

    if (totalPages <= 1) return null

    const hrefFor = (p) => {
        const query = new URLSearchParams(searchParams.toString())
        if (p <= 1) query.delete('page')
        else query.set('page', String(p))
        const qs = query.toString()
        return qs ? `?${qs}` : '?'
    }

    const windowStart = Math.max(1, current - 2)
    const windowEnd = Math.min(totalPages, windowStart + 4)
    const items = []
    for (let i = windowStart; i <= windowEnd; i++) items.push(i)

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
            {current > 1 ? (
                <Link
                    href={hrefFor(current - 1)}
                    className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition"
                    scroll={false}
                >
                    Prev
                </Link>
            ) : (
                <span className="px-3 py-1.5 border rounded-lg text-gray-300 cursor-not-allowed">
                    Prev
                </span>
            )}

            {items.map((p) => (
                <Link
                    key={p}
                    href={hrefFor(p)}
                    scroll={false}
                    className={`px-3 py-1.5 border rounded-lg transition ${
                        p === current
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'hover:bg-gray-50'
                    }`}
                >
                    {p}
                </Link>
            ))}

            {current < totalPages ? (
                <Link
                    href={hrefFor(current + 1)}
                    className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition"
                    scroll={false}
                >
                    Next
                </Link>
            ) : (
                <span className="px-3 py-1.5 border rounded-lg text-gray-300 cursor-not-allowed">
                    Next
                </span>
            )}
        </div>
    )
}

export default Pagination
