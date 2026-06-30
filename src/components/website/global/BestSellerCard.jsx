import Image from 'next/image'

export default function BestSellerCard({
    image,
    title,
    price,
    oldPrice,
    save,
    badges = [],
    stockStatus,
    variants = [],
}) {
    return (
        <div className="relative bg-white rounded-xl p-4 hover:shadow-lg transition">

            {/* Save badge */}
            {save && (
                <span className="absolute z-10 top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    SAVE ${save}
                </span>
            )}

            {/* Product image */}
            <div className="relative h-44 mb-4">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Title */}
            <h4 className="text-sm font-medium mb-2 line-clamp-2">
                {title}
            </h4>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-teal-600 font-semibold">
                    ${price}
                </span>

                {oldPrice && (
                    <span className="text-gray-400 text-sm line-through">
                        ${oldPrice}
                    </span>
                )}
            </div>

            {/* Badges */}
            {badges.length > 0 && (
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
            )}

            {/* Stock status */}
            {stockStatus && (
                <p className="text-xs text-gray-600 mb-2">
                    {stockStatus}
                </p>
            )}

            {/* Variants */}
            {variants.length > 0 && (
                <div className="flex gap-2">
                    {variants.map((variant, index) => (
                        <div key={index} className="relative w-8 h-8 border rounded-md">
                            <Image
                                src={variant}
                                alt="variant"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
