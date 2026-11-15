import Link from 'next/link'

export default function MarketplaceInfo() {
    return (
        <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-6 md:p-10 mt-8 border border-slate-200/60 dark:border-slate-800 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Swoo Tech Mart — Shop Smarter
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Browse curated electronics with clear pricing in INR, secure checkout,
                and fast support. From mobiles and laptops to accessories — find what
                you need and order in a few clicks.
            </p>

            <Link
                href="/products"
                className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
                Browse all products →
            </Link>
        </div>
    )
}
