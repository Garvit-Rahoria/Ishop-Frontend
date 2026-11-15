import { getCategories } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'
import Link from 'next/link'

export default async function TopCategories() {
    const categoryData = await getCategories({ status: true, is_top: true, limit: 4 })
    let categories = categoryData?.data || []

    // Fallback if no is_top categories
    if (categories.length === 0) {
        const fallback = await getCategories({ status: true, limit: 4 })
        categories = fallback?.data || []
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs p-5 h-full border border-slate-200/80 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Top Categories</h3>
                <Link
                    href="/products"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                    View All
                </Link>
            </div>

            {categories.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No categories yet</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/products/${cat.slug}`}
                            className="group flex flex-col items-center justify-center rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                        >
                            <div className="w-16 h-16 mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center">
                                {cat.image ? (
                                    <img
                                        src={resolveMediaUrl(categoryData?.meta?.imageBaseUrl, cat.image)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                    />
                                ) : (
                                    <span className="text-sm text-slate-400 font-semibold">
                                        {cat.name?.[0]}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
