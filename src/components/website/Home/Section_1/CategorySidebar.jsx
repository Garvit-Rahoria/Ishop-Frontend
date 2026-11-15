import { getCategories } from '@/api/api-call'
import Link from 'next/link'
import { resolveMediaUrl } from '@/utils/media'

export default async function CategorySidebar() {
    const categorydata = await getCategories({ status: true, is_home: true, limit: 5 })
    const categories = categorydata?.data || []
    return (
        <aside className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-xs p-4 border border-slate-200/80 dark:border-slate-800 transition-colors">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-wider uppercase">
                Featured Categories
            </h3>
            <ul className="space-y-2.5">
                {categories.map((cat, index) => (
                    <li key={cat._id || index}>
                        <Link
                            href={`/products/${cat.slug}`}
                            className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-slate-800/80 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shrink-0">
                                    <img
                                        src={resolveMediaUrl(categorydata?.meta?.imageBaseUrl, cat.image)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-200"
                                    />
                                </div>
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                    {cat.name}
                                </span>
                            </div>

                            <span className="text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full border border-teal-100 dark:border-teal-800/50">
                                {cat.count ?? 0}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
