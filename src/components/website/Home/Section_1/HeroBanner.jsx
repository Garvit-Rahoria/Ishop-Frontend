import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react'

export default function HeroBanner() {
    return (
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl min-h-[380px] md:min-h-[420px] flex items-center shadow-lg border border-slate-800 bg-slate-950 text-white group">
            {/* Dark Print Tech Banner Background */}
            <img
                src="/images/hero-tech-banner-dark.jpg"
                alt="Swoo Tech Mart - Latest Electronics & Gadgets"
                className="absolute inset-0 w-full h-full object-cover object-right md:object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />

            {/* Subtle Dark Gradient Veil on the left so white text is razor-sharp and legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent sm:max-w-xl md:max-w-2xl pointer-events-none" />

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-xl space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 backdrop-blur-md shadow-xs">
                    <Sparkles size={13} className="text-teal-400" />
                    <span>Mega Tech Clearance · Up to 40% Off</span>
                </div>

                {/* Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white leading-[1.15] tracking-tight">
                    Next-Gen Tech,{' '}
                    <span className="text-teal-400 block sm:inline">Smart Prices.</span>
                </h2>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-md font-normal">
                    Upgrade your setup with authentic flagships, ultrabooks, pro audio, and wearables with verified manufacturer warranty.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/30 transition group/btn cursor-pointer"
                    >
                        <span>Shop All Products</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 shadow-xs backdrop-blur-md transition"
                    >
                        <span>Explore Deals</span>
                    </Link>
                </div>

                {/* Mini Trust Highlights */}
                <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-300">
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800/80 shadow-xs backdrop-blur-md">
                        <Truck size={13} className="text-teal-400" />
                        <span>Free Shipping ₹199+</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800/80 shadow-xs backdrop-blur-md">
                        <ShieldCheck size={13} className="text-teal-400" />
                        <span>100% Genuine Warranty</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800/80 shadow-xs backdrop-blur-md">
                        <RotateCcw size={13} className="text-teal-400" />
                        <span>7-Day Replacement</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
