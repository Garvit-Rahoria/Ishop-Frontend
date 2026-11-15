'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AddToCartButton from '@/components/website/Store/Section_3/Products/AddToCartButton'
import { resolveMediaUrl } from '@/utils/media'
import {
    Truck,
    ShieldCheck,
    RotateCcw,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Star,
    Share2,
} from 'lucide-react'

export default function ProductDetailView({ product = {}, imageBaseUrl = '' }) {
    const images = [
        product.thumbnail,
        ...(Array.isArray(product.image) ? product.image : []),
    ]
        .filter(Boolean)
        .map((img) => resolveMediaUrl(imageBaseUrl, img))

    const uniqueImages = [...new Set(images)]
    const [active, setActive] = useState(uniqueImages[0] || '/placeholder.svg')
    const mainSrc = active || '/placeholder.svg'

    const discount = product.discount_percent ?? product.discount_percentage ?? 0
    const inStock = Boolean(product.stock)

    return (
        <div className="bg-slate-50/50 dark:bg-[#0b1120] min-h-screen py-6 md:py-10 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap">
                    <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                        Home
                    </Link>
                    <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
                    <Link href="/products" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                        Products
                    </Link>
                    {product.categoryId?.slug ? (
                        <>
                            <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
                            <Link
                                href={`/products/${product.categoryId.slug}`}
                                className="hover:text-teal-600 dark:hover:text-teal-400 transition"
                            >
                                {product.categoryId.name}
                            </Link>
                        </>
                    ) : null}
                    <ChevronRight size={12} className="text-slate-400 dark:text-slate-600" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">
                        {product.name}
                    </span>
                </nav>

                {/* Main Product Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 md:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-10 transition-colors">
                    {/* Left: Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative aspect-square w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 p-6 flex items-center justify-center overflow-hidden">
                            {discount > 0 && (
                                <span className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                                    {discount}% OFF
                                </span>
                            )}

                            <img
                                src={mainSrc}
                                alt={product.name || 'Product'}
                                className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg'
                                }}
                            />
                        </div>

                        {uniqueImages.length > 1 && (
                            <div className="flex gap-2.5 overflow-x-auto pb-1">
                                {uniqueImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActive(img)}
                                        className={`w-18 h-18 rounded-xl border-2 overflow-hidden shrink-0 bg-slate-50 dark:bg-slate-800 p-1.5 transition cursor-pointer ${
                                            active === img
                                                ? 'border-teal-500 ring-2 ring-teal-200 dark:ring-teal-900 shadow-xs'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-teal-300'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder.svg'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            {/* Badges / Category / Brand */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {product.categoryId?.name && (
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/50">
                                        {product.categoryId.name}
                                    </span>
                                )}
                                {product.brandId?.name && (
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        Brand: {product.brandId.name}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                                {product.name}
                            </h1>

                            {/* Ratings preview */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200">4.9</span>
                                <span>(Verified Buyer Rating)</span>
                            </div>

                            {/* Price Card */}
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-baseline gap-3">
                                <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                                    ₹{Number(product.final_price || 0).toLocaleString('en-IN')}
                                </span>
                                {product.orginal_price && Number(product.orginal_price) > Number(product.final_price) && (
                                    <span className="text-base text-slate-400 dark:text-slate-500 line-through">
                                        ₹{Number(product.orginal_price).toLocaleString('en-IN')}
                                    </span>
                                )}
                                {discount > 0 && (
                                    <span className="ml-auto text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/50 px-2.5 py-1 rounded-full">
                                        Save ₹{(product.orginal_price - product.final_price).toLocaleString('en-IN')}
                                    </span>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="flex items-center gap-2">
                                {inStock ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1 rounded-full">
                                        <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                                        <span>In Stock &amp; Ready for Dispatch</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/50 px-3 py-1 rounded-full">
                                        <XCircle size={13} className="text-rose-600 dark:text-rose-400" />
                                        <span>Currently Out of Stock</span>
                                    </span>
                                )}
                            </div>

                            {/* Short Description */}
                            {product.short_description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Colors */}
                            {Array.isArray(product.colorId) && product.colorId.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Available Color Shades
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.colorId.map((col, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center gap-2 text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-3 py-1.5 shadow-2xs"
                                            >
                                                <span
                                                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-inner"
                                                    style={{ backgroundColor: col.color_code || '#fff' }}
                                                />
                                                <span className="text-slate-700 dark:text-slate-200 font-semibold">{col.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <div className="pt-3 max-w-sm">
                                {inStock ? (
                                    <AddToCartButton product={product} imageBaseUrl={mainSrc} />
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs py-3 rounded-xl cursor-not-allowed"
                                    >
                                        Out of Stock
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Store Guarantees */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Truck size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                <span>Express 2-Day Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                <ShieldCheck size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                <span>1-Year Brand Warranty</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                <RotateCcw size={16} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                <span>7 Days Free Return</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Long Description Box */}
                {product.long_description && (
                    <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 md:p-10 shadow-2xs transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight pb-3 border-b border-slate-100 dark:border-slate-800">
                            Technical Specifications &amp; Description
                        </h2>
                        <div
                            className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed [&_p]:mb-3 [&_strong]:text-slate-900 dark:[&_strong]:text-slate-100 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_li]:mb-1.5 [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-slate-100 [&_h3]:text-base [&_h3]:mb-2 max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.long_description }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
