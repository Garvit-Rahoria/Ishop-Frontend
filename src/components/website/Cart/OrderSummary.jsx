'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

const OrderSummary = ({ hydrated = false }) => {
    const cart = useSelector((store) => store.cart);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const visibleCart = mounted && hydrated
        ? cart
        : { original_total: 0, final_total: 0, items: [] };

    const originalTotal = Number(visibleCart.original_total || 0);
    const finalTotal = Number(visibleCart.final_total || 0);
    const savings = Math.max(0, originalTotal - finalTotal);
    const hasItems = visibleCart.items && visibleCart.items.length > 0;
    const isFreeShipping = finalTotal >= 199;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Order Summary
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck size={12} />
                    <span>Verified</span>
                </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between items-center">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        ₹{originalTotal.toLocaleString("en-IN")}
                    </span>
                </div>

                {savings > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                        <span>Discount Savings</span>
                        <span>-₹{savings.toLocaleString("en-IN")}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span>Delivery Charges</span>
                    {isFreeShipping ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs">FREE</span>
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">₹40</span>
                    )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex justify-between items-baseline">
                    <div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">Total Payable</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Inclusive of all taxes</span>
                    </div>
                    <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
                        ₹{(finalTotal + (isFreeShipping ? 0 : 40)).toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            {!hasItems ? (
                <button
                    disabled
                    className="w-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase cursor-not-allowed"
                >
                    Cart is Empty
                </button>
            ) : (
                <Link href="/checkout" className="block">
                    <button
                        type="button"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-md shadow-teal-500/25 transition cursor-pointer"
                    >
                        <Lock size={15} />
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={15} />
                    </button>
                </Link>
            )}

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck size={13} className="text-teal-600" />
                <span>Encrypted 256-bit SSL Payment Gateway</span>
            </p>
        </div>
    );
};

export default OrderSummary;
