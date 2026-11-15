'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown, Grid, Sparkles, X } from 'lucide-react';

const ProductsToolbar = ({ total = 0, page = 1, limit = 9, q = null }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sort = searchParams.get('sort') || 'latest';
    const currentLimit = Number(searchParams.get('limit')) || Number(limit) || 9;

    function updateQuery(mutator) {
        const query = new URLSearchParams(searchParams.toString());
        mutator(query);
        router.push(`?${query.toString()}`, { scroll: false });
        router.refresh();
    }

    function filterHandler(e) {
        const value = e.target.value;
        updateQuery((query) => {
            if (value === 'latest') query.delete('sort');
            else query.set('sort', value);
            query.delete('page');
        });
    }

    function limitHandler(e) {
        const value = e.target.value;
        updateQuery((query) => {
            if (Number(value) === 9) query.delete('limit');
            else query.set('limit', value);
            query.delete('page');
        });
    }

    function clearSearch() {
        updateQuery((query) => {
            query.delete('q');
            query.delete('page');
        });
    }

    const start = total === 0 ? 0 : (page - 1) * currentLimit + 1;
    const end = Math.min(page * currentLimit, total);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-2xs transition-colors duration-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
                {/* Left: Results Count & Active Search Badge */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    {total === 0 ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            <span>No matching products found</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold text-xs border border-teal-200/70 dark:border-teal-800/60 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <span>
                                Showing <strong className="font-extrabold text-teal-950 dark:text-teal-100">{start}–{end}</strong> of{' '}
                                <strong className="font-extrabold text-teal-950 dark:text-teal-100">{total}</strong> Products
                            </span>
                        </div>
                    )}

                    {q && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                            <span>Search: <strong>“{q}”</strong></span>
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                                title="Clear search"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>

                {/* Right: Modern Show & Sort Select Controls */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    {/* Show Limit Selector */}
                    <div className="relative inline-flex items-center">
                        <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
                            <Grid size={13} />
                        </div>
                        <select
                            value={String(currentLimit)}
                            onChange={limitHandler}
                            aria-label="Products per page"
                            className="appearance-none pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition cursor-pointer shadow-2xs"
                        >
                            <option value="9">9 per page</option>
                            <option value="18">18 per page</option>
                            <option value="27">27 per page</option>
                            <option value="36">36 per page</option>
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">
                            ▼
                        </div>
                    </div>

                    {/* Sort Order Selector */}
                    <div className="relative inline-flex items-center">
                        <div className="absolute left-3 pointer-events-none text-slate-400 dark:text-slate-500 flex items-center">
                            <ArrowUpDown size={13} />
                        </div>
                        <select
                            value={sort}
                            onChange={filterHandler}
                            aria-label="Sort products by"
                            className="appearance-none pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition cursor-pointer shadow-2xs"
                        >
                            <option value="latest">Latest Arrivals</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">
                            ▼
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsToolbar;
