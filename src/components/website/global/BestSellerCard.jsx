'use client'

import Link from 'next/link'

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
}) {
    const src = image || '/placeholder.svg'

    const body = (
        <>
            {save ? (
                <span className="absolute z-10 top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {typeof save === 'number' && save < 100
                        ? `${save}% OFF`
                        : `SAVE ₹${save}`}
                </span>
            ) : null}

            <div className="relative h-44 mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                    src={src}
                    alt={title || 'Product'}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg'
                    }}
                />
            </div>

            <h4 className="text-sm font-medium mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition">
                {title}
            </h4>

            <div className="flex items-center gap-2 mb-2">
                <span className="text-teal-600 font-semibold">₹{price}</span>
                {oldPrice ? (
                    <span className="text-gray-400 text-sm line-through">
                        ₹{oldPrice}
                    </span>
                ) : null}
            </div>

            {badges.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-2">
                    {badges.map((badge, index) => (
                        <span
                            key={index}
                            className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            ) : null}

            {stockStatus ? (
                <p className="text-xs text-gray-600 mb-2">{stockStatus}</p>
            ) : null}

            {variants.length > 0 ? (
                <div className="flex gap-2">
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            className="w-8 h-8 border rounded-md overflow-hidden bg-gray-50"
                        >
                            <img
                                src={variant}
                                alt="variant"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder.svg'
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    )

    const className =
        'relative bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition block group'

    if (href) {
        return (
            <Link href={href} className={className}>
                {body}
            </Link>
        )
    }

    return <div className={className}>{body}</div>
}
