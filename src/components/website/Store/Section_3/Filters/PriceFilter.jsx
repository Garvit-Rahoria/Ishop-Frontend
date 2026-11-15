'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { IndianRupee, RotateCcw, ArrowRight } from 'lucide-react';

const PRESETS = [
    { label: 'Under ₹5k', min: 0, max: 5000 },
    { label: '₹5k - ₹20k', min: 5000, max: 20000 },
    { label: '₹20k - ₹50k', min: 20000, max: 50000 },
    { label: '₹50k+', min: 50000, max: 200000 },
];

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const MIN_LIMIT = 0;
    const MAX_LIMIT = 200000;

    const minQuery = Number(searchParams.get('min_price'));
    const maxQuery = Number(searchParams.get('max_price'));

    const [min, setMin] = useState(
        Number.isFinite(minQuery) && minQuery > 0 ? minQuery : MIN_LIMIT
    );
    const [max, setMax] = useState(
        Number.isFinite(maxQuery) && maxQuery > 0 ? maxQuery : MAX_LIMIT
    );

    // Keep state in sync with URL searchParams
    useEffect(() => {
        setMin(Number.isFinite(minQuery) && minQuery > 0 ? minQuery : MIN_LIMIT);
        setMax(Number.isFinite(maxQuery) && maxQuery > 0 ? maxQuery : MAX_LIMIT);
    }, [minQuery, maxQuery]);

    const handleMinChange = (e) => {
        const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        setMin(val);
    };

    const handleMaxChange = (e) => {
        const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        setMax(val);
    };

    const applyPreset = (presetMin, presetMax) => {
        setMin(presetMin);
        setMax(presetMax);
        const params = new URLSearchParams(searchParams.toString());
        params.set('min_price', String(presetMin));
        params.set('max_price', String(presetMax));
        params.delete('page');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (min !== '' && max !== '' && Number(min) > Number(max)) {
            alert('Min price cannot be greater than max price');
            return;
        }

        if (
            min === '' ||
            max === '' ||
            (Number(min) === MIN_LIMIT && Number(max) === MAX_LIMIT)
        ) {
            params.delete('min_price');
            params.delete('max_price');
        } else {
            params.set('min_price', String(min));
            params.set('max_price', String(max));
        }
        params.delete('page');
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const clearFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('min_price');
        params.delete('max_price');
        params.delete('page');
        setMin(MIN_LIMIT);
        setMax(MAX_LIMIT);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const isFiltered = min !== MIN_LIMIT || max !== MAX_LIMIT;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Price Range
                </h4>
                {isFiltered && (
                    <button
                        type="button"
                        onClick={clearFilter}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                    >
                        <RotateCcw size={11} />
                        <span>Reset</span>
                    </button>
                )}
            </div>

            {/* Quick Price Preset Pills */}
            <div className="grid grid-cols-2 gap-1.5">
                {PRESETS.map((p, idx) => {
                    const isActive = min === p.min && max === p.max;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => applyPreset(p.min, p.max)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-center transition cursor-pointer border ${
                                isActive
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-2xs font-bold'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:text-teal-600 dark:hover:bg-slate-700/60'
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Inputs Box */}
            <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="grid grid-cols-2 gap-2.5 items-center">
                    {/* Min Input */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                            Min Price
                        </span>
                        <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-slate-400 dark:text-slate-500 font-bold text-xs pointer-events-none">
                                ₹
                            </span>
                            <input
                                type="number"
                                min={0}
                                max={200000}
                                value={min}
                                onChange={handleMinChange}
                                placeholder="0"
                                className="w-full h-9 pl-6 pr-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                            />
                        </div>
                    </div>

                    {/* Max Input */}
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                            Max Price
                        </span>
                        <div className="relative flex items-center">
                            <span className="absolute left-2.5 text-slate-400 dark:text-slate-500 font-bold text-xs pointer-events-none">
                                ₹
                            </span>
                            <input
                                type="number"
                                min={0}
                                max={200000}
                                value={max}
                                onChange={handleMaxChange}
                                placeholder="200000"
                                className="w-full h-9 pl-6 pr-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                <button
                    type="button"
                    onClick={applyFilter}
                    className="w-full h-9 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl transition shadow-xs shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                    <span>Apply Price Filter</span>
                    <ArrowRight size={13} />
                </button>
            </div>
        </div>
    );
}
