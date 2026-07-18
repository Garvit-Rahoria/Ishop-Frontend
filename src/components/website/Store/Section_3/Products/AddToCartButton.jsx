'use client'
import { addToCart, qtyChange } from '@/redux/features/cartSlice'
import { client } from '@/utils/helper'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
    const cart       = useSelector((store) => store.cart);
    const cartItem   = cart?.items.find((item) => item.id == product._id);
    const dispatcher = useDispatch();

    const handleAdd = () => {
        dispatcher(addToCart({
            id:                  product._id,
            name:                product?.name,
            thumbnail:           imageBaseUrl,
            orginal_price:       product.orginal_price,
            discount_percentage: product.discount_percentage,
            final_price:         product.final_price,
            stock:               product.stock,
            qty:                 1,
        }));
        syncItemToDb(product._id, 1);
    };

    const handleInc = () => {
        dispatcher(qtyChange({ id: product._id, flag: "inc" }));
        syncItemToDb(product._id, 1);
    };

    const handleDec = () => {
        dispatcher(qtyChange({ id: product._id, flag: "dec" }));
        // No DB call needed for dec — cart is re-synced on next login
    };

    return (
        <div>
            {cartItem ? (
                <div className="flex items-center justify-center gap-3 mt-2 w-full border-teal-500 rounded-md p-1">
                    <button
                        onClick={handleDec}
                        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white font-bold rounded hover:bg-teal-500 hover:text-white transition-colors duration-200"
                    >
                        −
                    </button>

                    <h2 className="font-semibold text-gray-800 text-sm">
                        {cartItem.qty || 0}
                    </h2>

                    <button
                        onClick={handleInc}
                        className="flex items-center justify-center w-8 h-8 bg-green-500 text-white font-bold rounded hover:bg-teal-500 hover:text-white transition-colors duration-200"
                    >
                        +
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAdd}
                    className="mt-2 w-full bg-teal-500 text-white text-[14px] font-medium py-2 rounded-md hover:bg-teal-600 active:scale-95 transition-all shadow-md"
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
}
