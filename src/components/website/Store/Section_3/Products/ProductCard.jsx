'use client'

import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

const ProductCard = ({
    product,
    imageBaseUrl,
    name,
    orginal_price,
    discount_percentage,
    final_price,
}) => {
    const src = imageBaseUrl || "/placeholder.svg";
    const href = product?.slug ? `/product/${product.slug}` : null;

    const media = (
        <div className="h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
            <img
                src={src}
                alt={name || "Product"}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                }}
            />
        </div>
    );

    return (
        <div className="relative bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
            {discount_percentage ? (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded z-10">
                    {discount_percentage}% OFF
                </span>
            ) : null}

            {href ? (
                <Link href={href} className="block group">
                    {media}
                    <h3 className="text-sm font-medium mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 transition">
                        {name}
                    </h3>
                </Link>
            ) : (
                <>
                    {media}
                    <h3 className="text-sm font-medium mb-1 line-clamp-2 min-h-[2.5rem]">
                        {name}
                    </h3>
                </>
            )}

            <div className="text-sm mb-3">
                <span className="text-red-500 font-semibold">₹{final_price}</span>
                {orginal_price ? (
                    <span className="line-through text-gray-400 ml-2">
                        ₹{orginal_price}
                    </span>
                ) : null}
            </div>

            <AddToCartButton product={product} imageBaseUrl={src} />
        </div>
    );
};

export default ProductCard;
