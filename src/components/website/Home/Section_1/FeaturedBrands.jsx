import { getBrands } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'
import Link from 'next/link'

export default async function FeaturedBrands() {
    const brandData = await getBrands({ status: true, is_popular: true, limit: 10 })
    const brands = brandData?.data || []

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs p-5 h-full border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Featured Brands</h3>
                <Link
                    href="/products"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                    View All
                </Link>
            </div>

            {brands.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No brands yet</p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {brands.map((brd) => (
                        <Link
                            key={brd._id}
                            href={`/products?brand_slug=${brd.slug}`}
                            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 hover:border-teal-200 dark:hover:border-teal-700 hover:bg-teal-50/40 dark:hover:bg-slate-800 transition"
                        >
                            <div className="w-full aspect-square max-h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                {brd?.image ? (
                                    <img
                                        src={resolveMediaUrl(brandData?.meta?.imageBaseUrl, brd.image)}
                                        alt={brd.name}
                                        className="max-h-full max-w-full object-contain p-1"
                                    />
                                ) : (
                                    <span className="text-xs text-slate-400">{brd.name?.[0]}</span>
                                )}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                {brd.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
