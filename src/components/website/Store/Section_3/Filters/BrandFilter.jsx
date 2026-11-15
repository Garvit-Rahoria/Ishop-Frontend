'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'

export default function BrandFilter({ brands = [] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const select_brand = searchParams.get('brand_slug')

    function filterHandler(slug) {
        const query = new URLSearchParams(searchParams.toString())
        if (slug === select_brand) {
            query.delete('brand_slug')
        } else {
            query.set('brand_slug', slug)
        }
        query.delete('page')
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh()
    }

    function clearBrandFunction() {
        const query = new URLSearchParams(searchParams.toString())
        query.delete('brand_slug')
        query.delete('page')
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Brand
                </h4>
                {select_brand ? (
                    <button
                        type="button"
                        onClick={clearBrandFunction}
                        className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                        Reset
                    </button>
                ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5">
                {brands.map((brand) => {
                    const isActive = select_brand === brand.slug

                    return (
                        <button
                            type="button"
                            key={brand._id}
                            onClick={() => filterHandler(brand.slug)}
                            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                                isActive
                                    ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-300'
                            }`}
                        >
                            <span>{brand.name}</span>
                            {brand.count ? (
                                <span
                                    className={`text-[10px] px-1 rounded ${
                                        isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300'
                                    }`}
                                >
                                    {brand.count}
                                </span>
                            ) : null}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
