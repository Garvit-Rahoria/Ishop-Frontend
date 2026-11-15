import Link from 'next/link'
import { getCategories } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function SectionSix() {
    const categoryData = await getCategories({ status: true, limit: 12 })
    const categories = categoryData?.data || []

    // Split into 3 showcase cards
    const chunks = [0, 1, 2].map((i) => categories.slice(i * 4, i * 4 + 4))
    const titles = ['SHOP BY CATEGORY', 'MORE TO EXPLORE', 'TRENDING NOW']

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chunks.map((group, index) => (
                    <div key={titles[index]} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{titles[index]}</h4>
                            <Link
                                href="/products"
                                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="h-24 bg-gradient-to-r from-slate-900 to-teal-800 flex items-center px-5">
                            <p className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                                Discover gadgets for every need
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-5">
                            {group.length === 0 ? (
                                <p className="col-span-2 text-xs text-slate-400 text-center py-4">
                                    No categories
                                </p>
                            ) : (
                                group.map((cat) => (
                                    <Link
                                        key={cat._id}
                                        href={`/products/${cat.slug}`}
                                        className="text-center group p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-700">
                                            {cat.image ? (
                                                <img
                                                    src={resolveMediaUrl(
                                                        categoryData?.meta?.imageBaseUrl,
                                                        cat.image
                                                    )}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-slate-400">
                                                    {cat.name?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 line-clamp-1">
                                            {cat.name}
                                        </p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
