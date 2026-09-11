'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrderSummary = ({ hydrated = false }) => {
    const cart = useSelector((store) => store.cart);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const visibleCart = mounted && hydrated
        ? cart
        : { original_total: 0, final_total: 0, items: [] };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">Secure</span>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                    <span>Sub Total</span>
                    <span className="font-medium">₹{visibleCart.original_total}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>You Save</span>
                    <span className="font-semibold text-green-600">₹{visibleCart.original_total - visibleCart.final_total}</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-teal-600">₹{visibleCart.final_total}</span>
                </div>
            </div>

            <Link href="/checkout" aria-disabled={!mounted || !hydrated || visibleCart.items.length === 0}>
                <button
                    disabled={!mounted || !hydrated || visibleCart.items.length === 0}
                    className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Checkout
                </button>
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">Safe &amp; Secure Payments</p>
        </div>
    );
};

export default OrderSummary;
