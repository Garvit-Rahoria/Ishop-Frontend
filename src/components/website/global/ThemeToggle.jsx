'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ showLabel = false, className = '' }) {
    const { isDark, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <div
                className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 animate-pulse ${className}`}
                aria-hidden="true"
            />
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                isDark
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-slate-600 hover:text-amber-300 shadow-sm'
                    : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 shadow-2xs'
            } ${className}`}
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                {isDark ? (
                    <Sun
                        size={16}
                        className="transition-transform duration-300 rotate-0 scale-100"
                    />
                ) : (
                    <Moon
                        size={16}
                        className="transition-transform duration-300 rotate-0 scale-100 text-slate-700"
                    />
                )}
            </div>

            {showLabel && (
                <span className="text-xs font-bold capitalize">
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
}

