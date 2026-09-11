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
                    <div key={titles[index]} className="bg-white rounded-xl border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h4 className="text-sm font-semibold uppercase">{titles[index]}</h4>
                            <Link
                                href="/products"
                                className="text-xs text-gray-500 hover:text-teal-500"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="h-28 bg-gradient-to-r from-slate-800 to-teal-700 flex items-center px-5">
                            <p className="text-white text-sm font-medium">
                                Discover gadgets for every need
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-4">
                            {group.length === 0 ? (
                                <p className="col-span-2 text-xs text-gray-400 text-center py-4">
                                    No categories
                                </p>
                            ) : (
                                group.map((cat) => (
                                    <Link
                                        key={cat._id}
                                        href={`/products/${cat.slug}`}
                                        className="text-center group"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border">
                                            {cat.image ? (
                                                <img
                                                    src={resolveMediaUrl(
                                                        categoryData?.meta?.imageBaseUrl,
                                                        cat.image
                                                    )}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-400">
                                                    {cat.name?.[0]}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium group-hover:text-teal-600 line-clamp-1">
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
