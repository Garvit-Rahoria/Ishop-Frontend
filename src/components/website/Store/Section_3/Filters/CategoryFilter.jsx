'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CategoryFilter({ categories = [] }) {
    const pathname = usePathname()
    const isAllActive = pathname === '/products'

    return (
        <div>
            <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">
                Category
            </h4>

            {/* All Categories Button */}
            <Link href="/products" className="block mb-3">
                <button
                    type="button"
                    className={`w-full text-xs font-semibold px-3 py-2 rounded-xl border transition cursor-pointer text-left flex items-center justify-between ${
                        isAllActive
                            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50/50 dark:hover:bg-slate-700'
                    }`}
                >
                    <span>All Categories</span>
                    <span className="text-[11px] opacity-80">All</span>
                </button>
            </Link>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                    const isActive = pathname === `/products/${cat.slug}`

                    return (
                        <Link key={cat._id} href={`/products/${cat.slug}`}>
                            <div
                                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                                    isActive
                                        ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300'
                                }`}
                            >
                                <span>{cat.name}</span>
                                {cat.count ? (
                                    <span
                                        className={`text-[10px] px-1 rounded ${
                                            isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
                                        }`}
                                    >
                                        {cat.count}
                                    </span>
                                ) : null}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
