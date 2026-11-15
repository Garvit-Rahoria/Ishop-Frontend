'use client'

import React from 'react'
import Link from 'next/link'
import AddToCartButton from '@/components/website/Store/Section_3/Products/AddToCartButton'

export default function BestSellerCard({
    image,
    title,
    price,
    oldPrice,
    save,
    badges = [],
    stockStatus,
    variants = [],
    href,
    product,
}) {
    const src = image || '/placeholder.svg'
    const discount = typeof save === 'number' ? save : 0
    const inStock = stockStatus ? !stockStatus.toLowerCase().includes('out') : true

    // Minimal product structure for AddToCartButton if not provided
    const prodObj = product ? { ...product, _id: product._id || product.id, id: product._id || product.id } : {
        _id: href ? href.replace(/^\/product\//, '') : Math.random().toString(),
        name: title,
        final_price: price,
        orginal_price: oldPrice,
        discount_percentage: discount,
        stock: inStock,
    }

    return (
        <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
            <div>
                {/* Media frame */}
                <div className="relative aspect-square w-full mb-3.5 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center p-3 overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition">
                    {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs tracking-tight">
                            -{discount}%
                        </span>
                    )}

                    <img
                        src={src}
                        alt={title || 'Product'}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-2xs"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg'
                        }}
                    />
                </div>

                {/* Title */}
                {href ? (
                    <Link href={href} className="block">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                            {title}
                        </h4>
                    </Link>
                ) : (
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 line-clamp-2 min-h-[2.5rem] leading-snug">
                        {title}
                    </h4>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        ₹{Number(price || 0).toLocaleString('en-IN')}
                    </span>
                    {oldPrice && Number(oldPrice) > Number(price) && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                            ₹{Number(oldPrice).toLocaleString('en-IN')}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Add to Cart action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {inStock ? (
                    <AddToCartButton product={prodObj} imageBaseUrl={src} />
                ) : (
                    <button
                        disabled
                        className="w-full text-center py-2 text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-not-allowed"
                    >
                        Out of Stock
                    </button>
                )}
            </div>
        </div>
    )
}
