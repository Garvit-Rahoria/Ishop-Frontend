'use client';

import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#0b1120] select-none transition-colors duration-200">
            {/* Animated Brand Pulse Container */}
            <div className="relative flex items-center justify-center mb-6">
                {/* Outer glowing pulsing aura */}
                <div className="absolute w-28 h-28 rounded-full bg-teal-400/20 dark:bg-teal-500/10 blur-xl animate-ping" />
                <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-md animate-pulse" />

                {/* Spinning dual rings */}
                <div
                    className="w-20 h-20 rounded-full border-2 border-dashed border-teal-200 dark:border-teal-700/60 animate-spin"
                    style={{ animationDuration: '8s' }}
                />
                <div
                    className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-teal-600 dark:border-t-teal-400 border-r-teal-500 dark:border-r-teal-300 animate-spin"
                    style={{ animationDuration: '1.2s' }}
                />

                {/* Central Brand Emblem */}
                <div className="absolute w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/25">
                    S
                </div>
            </div>

            {/* Typography */}
            <div className="text-center space-y-2 max-w-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-widest border border-teal-200/60 dark:border-teal-800/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 animate-pulse" />
                    <span>Swoo Tech Mart</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                    Loading Premium Gadgets...
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">
                    Curating authentic specs, live prices, and trending offers
                </p>

                {/* Sleek Progress Bar */}
                <div className="pt-2 w-48 sm:w-56 mx-auto">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60 relative">
                        <div className="h-full w-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600 animate-pulse rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
