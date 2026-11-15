'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, RotateCcw } from 'lucide-react';

export default function ColorFilter({ colors = [] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawColor = searchParams.get('color_slug');
    const select_color = rawColor ? rawColor.split(',') : [];

    function filterHandler(slug) {
        let updatedColors = [];
        if (select_color.includes(slug)) {
            updatedColors = select_color.filter((c) => c !== slug);
        } else {
            updatedColors = [...select_color, slug];
        }

        const query = new URLSearchParams(searchParams.toString());
        if (updatedColors.length > 0) {
            query.set('color_slug', updatedColors.join(','));
        } else {
            query.delete('color_slug');
        }
        query.delete('page');
        router.push(`?${query.toString()}`, { scroll: false });
    }

    function clearColorFunction() {
        const query = new URLSearchParams(searchParams.toString());
        query.delete('color_slug');
        query.delete('page');
        router.push(`?${query.toString()}`, { scroll: false });
    }

    // Helper to determine if color is light (needs dark checkmark & border)
    const isLightColor = (hex) => {
        if (!hex) return false;
        const clean = hex.replace('#', '');
        if (clean.length === 6) {
            const r = parseInt(clean.substring(0, 2), 16);
            const g = parseInt(clean.substring(2, 4), 16);
            const b = parseInt(clean.substring(4, 6), 16);
            // YIQ brightness formula
            return (r * 299 + g * 587 + b * 114) / 1000 > 180;
        }
        return false;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Color Variants
                </h4>
                {select_color.length > 0 && (
                    <button
                        type="button"
                        onClick={clearColorFunction}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                    >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* Modern Color Swatches Grid */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex flex-wrap gap-2.5">
                    {colors.map((color) => {
                        const isSelected = select_color.includes(color.slug);
                        const isLight = isLightColor(color.color_code);

                        return (
                            <button
                                type="button"
                                key={color._id}
                                onClick={() => filterHandler(color.slug)}
                                title={color.name ? color.name.toUpperCase() : color.slug}
                                aria-label={`Filter by ${color.name || color.slug}`}
                                className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer relative group ${
                                    isSelected
                                        ? 'ring-2 ring-teal-600 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-110 shadow-sm'
                                        : 'hover:scale-105 hover:shadow-xs'
                                } ${
                                    isLight || color.color_code?.toLowerCase() === '#ffffff'
                                        ? 'border border-slate-300 dark:border-slate-600'
                                        : 'border border-black/10 dark:border-white/10'
                                }`}
                                style={{ backgroundColor: color.color_code || '#ccc' }}
                            >
                                {isSelected && (
                                    <Check
                                        size={14}
                                        strokeWidth={3}
                                        className={isLight ? 'text-slate-900' : 'text-white'}
                                    />
                                )}

                                {/* Subtle Tooltip on Hover */}
                                <span className="absolute -bottom-7 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold whitespace-nowrap shadow-md z-20 pointer-events-none capitalize">
                                    {color.name || color.slug}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Selected Color Badges preview */}
                {select_color.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Active:</span>
                        {select_color.map((slug) => (
                            <span
                                key={slug}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-[10px] font-bold border border-teal-200/60 dark:border-teal-800/60 capitalize"
                            >
                                <span>{slug}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
