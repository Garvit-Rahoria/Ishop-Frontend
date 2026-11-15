'use client'

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { lsToCart } from "@/redux/features/cartSlice";
import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

const CartPage = () => {
    const cart = useSelector((store) => store.cart);
    const dispatch = useDispatch();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        dispatch(lsToCart());
        setHydrated(true);
    }, [dispatch]);

    const items = cart?.items || [];

    return (
        <section className="bg-slate-50/60 dark:bg-[#0b1120] min-h-[70vh] py-8 md:py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumbs */}
                <nav className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
                    <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition">Home</Link>
                    <span>/</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">Shopping Cart</span>
                </nav>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                            Shopping Cart
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Review your selected tech gadgets and proceed to secure checkout.
                        </p>
                    </div>

                    {items.length > 0 && (
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/50 px-3 py-1.5 rounded-full">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-10 md:p-16 text-center max-w-xl mx-auto shadow-2xs transition-colors">
                        <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-5 border border-teal-100 dark:border-teal-800/50">
                            <ShoppingBag size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Your Shopping Cart is Empty
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            Looks like you haven't added anything to your cart yet. Explore our latest electronics and find your next favorite tech gear!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-teal-600/20 transition cursor-pointer"
                        >
                            <span>Browse Products</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Cart Items list */}
                        <div className="lg:col-span-8 space-y-4">
                            {items.map((item, index) => (
                                <CartItem key={item.id || item._id || index} item={item} />
                            ))}

                            {/* Trust badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                                    <Truck size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                    <span>Free Shipping over ₹199</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                                    <ShieldCheck size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                    <span>100% Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                                    <RotateCcw size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
                                    <span>Easy Returns &amp; Refunds</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Box */}
                        <div className="lg:col-span-4 sticky top-24">
                            <OrderSummary hydrated={hydrated} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CartPage;
