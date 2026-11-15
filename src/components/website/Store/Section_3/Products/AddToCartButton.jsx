'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, qtyChange } from '@/redux/features/cartSlice'
import { client } from '@/utils/helper'
import { ShoppingBag, Minus, Plus } from 'lucide-react'

// Persist cart item to DB if user is logged in (token present)
const syncItemToDb = (productId, qty = 1) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("jwt");
    if (!token) return; // guest user — localStorage only
    client.post("/cart/add", { id: productId, qty }).catch((err) => {
        console.warn("DB cart sync failed:", err?.response?.data?.message || err.message);
    });
};

export default function AddToCartButton({ product, imageBaseUrl }) {
    const cart = useSelector((store) => store.cart);
    const cartItem = cart?.items?.find((item) => (item.id || item._id) == (product?._id || product?.id));
    const dispatcher = useDispatch();

    const handleAdd = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        dispatcher(addToCart({
            id:                  product._id || product.id,
            name:                product?.name,
            thumbnail:           imageBaseUrl,
            orginal_price:       product.orginal_price,
            discount_percentage: product.discount_percent ?? product.discount_percentage,
            final_price:         product.final_price,
            stock:               product.stock,
            qty:                 1,
        }));
        syncItemToDb(product._id || product.id, 1);
    };

    const handleInc = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        dispatcher(qtyChange({ id: product._id || product.id, flag: "inc" }));
        syncItemToDb(product._id || product.id, 1);
    };

    const handleDec = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        dispatcher(qtyChange({ id: product._id || product.id, flag: "dec" }));
    };

    return (
        <div className="w-full">
            {cartItem ? (
                <div className="flex items-center justify-between border border-teal-500/40 dark:border-teal-600/50 bg-teal-50/60 dark:bg-teal-950/40 rounded-xl p-1 shadow-2xs transition-colors">
                    <button
                        type="button"
                        onClick={handleDec}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-teal-800 dark:text-teal-300 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 transition duration-150 cursor-pointer"
                        title="Decrease quantity"
                    >
                        <Minus size={13} />
                    </button>

                    <span className="font-extrabold text-teal-950 dark:text-teal-100 text-xs px-2">
                        {cartItem.qty || 1} in cart
                    </span>

                    <button
                        type="button"
                        onClick={handleInc}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-teal-800 dark:text-teal-300 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 transition duration-150 cursor-pointer"
                        title="Increase quantity"
                    >
                        <Plus size={13} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleAdd}
                    className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer"
                >
                    <ShoppingBag size={14} />
                    <span>Add to Cart</span>
                </button>
            )}
        </div>
    );
}
