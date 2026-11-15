'use client'

import React from "react";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import { resolveMediaUrl } from "@/utils/media";

const ProductCard = ({
    product = {},
    imageBaseUrl,
    name,
    orginal_price,
    discount_percentage,
    final_price,
}) => {
    const pName = name || product?.name || "Product";
    const pOriginal = orginal_price ?? product?.orginal_price;
    const pFinal = final_price ?? product?.final_price ?? 0;
    const pDiscount = discount_percentage ?? product?.discount_percent ?? product?.discount_percentage ?? 0;
    const inStock = product?.stock !== false;

    const rawThumb = product?.thumbnail || imageBaseUrl;
    const src = resolveMediaUrl("", rawThumb) || "/placeholder.svg";
    const href = product?.slug ? `/product/${product.slug}` : null;

    const media = (
        <div className="relative aspect-square w-full mb-3.5 flex items-center justify-center bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl overflow-hidden p-4 border border-slate-100 dark:border-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
            {pDiscount > 0 && (
                <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs z-10 tracking-tight">
                    -{pDiscount}%
                </span>
            )}

            <img
                src={src}
                alt={pName}
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-2xs"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                }}
            />
        </div>
    );

    return (
        <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:shadow-lg hover:border-slate-300/80 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
            <div>
                {href ? (
                    <Link href={href} className="block">
                        {media}
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                            {pName}
                        </h3>
                    </Link>
                ) : (
                    <div>
                        {media}
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1.5 line-clamp-2 min-h-[2.5rem] leading-snug">
                            {pName}
                        </h3>
                    </div>
                )}

                {/* Pricing row */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        ₹{Number(pFinal).toLocaleString("en-IN")}
                    </span>
                    {pOriginal && Number(pOriginal) > Number(pFinal) && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                            ₹{Number(pOriginal).toLocaleString("en-IN")}
                        </span>
                    )}
                </div>
            </div>

            {/* Add to Cart button */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                {inStock ? (
                    <AddToCartButton product={product} imageBaseUrl={src} />
                ) : (
                    <button
                        disabled
                        className="w-full text-center py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-not-allowed"
                    >
                        Out of Stock
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
