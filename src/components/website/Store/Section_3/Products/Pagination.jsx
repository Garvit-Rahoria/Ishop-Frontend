'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page = 1, pages = 0 }) => {
    const searchParams = useSearchParams();
    const current = Number(page) || 1;
    const totalPages = Number(pages) || 0;

    if (totalPages <= 1) return null;

    const hrefFor = (p) => {
        const query = new URLSearchParams(searchParams.toString());
        if (p <= 1) query.delete('page');
        else query.set('page', String(p));
        const qs = query.toString();
        return qs ? `?${qs}` : '?';
    };

    const windowStart = Math.max(1, current - 2);
    const windowEnd = Math.min(totalPages, windowStart + 4);
    const items = [];
    for (let i = windowStart; i <= windowEnd; i++) items.push(i);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
                Page <strong className="text-slate-800 dark:text-slate-100 font-bold">{current}</strong> of{' '}
                <strong className="text-slate-800 dark:text-slate-100 font-bold">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                {current > 1 ? (
                    <Link
                        href={hrefFor(current - 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition shadow-2xs"
                        scroll={false}
                    >
                        <ChevronLeft size={14} />
                        <span>Prev</span>
                    </Link>
                ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed">
                        <ChevronLeft size={14} />
                        <span>Prev</span>
                    </span>
                )}

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1">
                    {items.map((p) => (
                        <Link
                            key={p}
                            href={hrefFor(p)}
                            scroll={false}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition ${
                                p === current
                                    ? 'bg-teal-600 text-white shadow-xs'
                                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400'
                            }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>

                {/* Next Button */}
                {current < totalPages ? (
                    <Link
                        href={hrefFor(current + 1)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-semibold transition shadow-2xs"
                        scroll={false}
                    >
                        <span>Next</span>
                        <ChevronRight size={14} />
                    </Link>
                ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500 font-medium cursor-not-allowed">
                        <span>Next</span>
                        <ChevronRight size={14} />
                    </span>
                )}
            </div>
        </div>
    );
};

export default Pagination;
