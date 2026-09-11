'use client'

import AddToCartButton from '@/components/website/Store/Section_3/Products/AddToCartButton'
import { resolveMediaUrl } from '@/utils/media'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductDetailView({ product, imageBaseUrl = '' }) {
    const images = [
        product.thumbnail,
        ...(Array.isArray(product.image) ? product.image : []),
    ]
        .filter(Boolean)
        .map((img) => resolveMediaUrl(imageBaseUrl, img))

    const uniqueImages = [...new Set(images)]
    const [active, setActive] = useState(uniqueImages[0] || '/placeholder.svg')
    const mainSrc = active || '/placeholder.svg'

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <nav className="text-sm text-gray-500 mb-6 flex flex-wrap gap-1">
                <Link href="/" className="hover:text-teal-600">
                    Home
                </Link>
                <span>/</span>
                <Link href="/products" className="hover:text-teal-600">
                    Products
                </Link>
                {product.categoryId?.slug ? (
                    <>
                        <span>/</span>
                        <Link
                            href={`/products/${product.categoryId.slug}`}
                            className="hover:text-teal-600"
                        >
                            {product.categoryId.name}
                        </Link>
                    </>
                ) : null}
                <span>/</span>
                <span className="text-gray-800">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 h-80 sm:h-[420px] flex items-center justify-center overflow-hidden p-6">
                        <img
                            src={mainSrc}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg'
                            }}
                        />
                    </div>
                    {uniqueImages.length > 1 ? (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                            {uniqueImages.map((img) => (
                                <button
                                    key={img}
                                    type="button"
                                    onClick={() => setActive(img)}
                                    className={`w-16 h-16 rounded-lg border overflow-hidden shrink-0 bg-white ${
                                        active === img
                                            ? 'border-teal-500 ring-2 ring-teal-200'
                                            : 'border-gray-200'
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
                    ) : null}
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                        {product.brandId?.name ? (
                            <p className="text-sm text-gray-500 mt-1">
                                Brand:{' '}
                                <span className="font-medium text-gray-700">
                                    {product.brandId.name}
                                </span>
                            </p>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-teal-600">
                            ₹{product.final_price}
                        </span>
                        {product.orginal_price ? (
                            <span className="text-gray-400 line-through">
                                ₹{product.orginal_price}
                            </span>
                        ) : null}
                        {product.discount_percentage ? (
                            <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded">
                                {product.discount_percentage}% OFF
                            </span>
                        ) : null}
                    </div>

                    <p
                        className={`text-sm font-medium ${
                            product.stock ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {product.stock ? 'In stock' : 'Out of stock'}
                    </p>

                    {product.short_description ? (
                        <p className="text-gray-600 leading-relaxed">
                            {product.short_description}
                        </p>
                    ) : null}

                    {product.colorId?.length ? (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                Colors
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.colorId.map((c) => (
                                    <span
                                        key={c._id}
                                        className="inline-flex items-center gap-2 text-xs border rounded-full px-3 py-1"
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full border"
                                            style={{
                                                backgroundColor: c.color_code || '#ccc',
                                            }}
                                        />
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="max-w-xs">
                        {product.stock ? (
                            <AddToCartButton
                                product={product}
                                imageBaseUrl={mainSrc}
                            />
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="w-full bg-gray-300 text-gray-600 py-2 rounded-md cursor-not-allowed"
                            >
                                Out of stock
                            </button>
                        )}
                    </div>

                    {product.long_description ? (
                        <div className="mt-4 pt-4 border-t">
                            <h2 className="font-semibold text-gray-800 mb-2">
                                Description
                            </h2>
                            <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                {product.long_description}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
