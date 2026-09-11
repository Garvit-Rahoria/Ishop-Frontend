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
        <div className="bg-white rounded-xl shadow-sm p-5 h-full">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800">Top Categories</h3>
                <Link
                    href="/products"
                    className="text-sm text-gray-500 hover:text-teal-500 transition"
                >
                    View All
                </Link>
            </div>

            {categories.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No categories yet</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            href={`/products/${cat.slug}`}
                            className="group flex flex-col items-center justify-center rounded-xl p-3 hover:bg-gray-50 transition"
                        >
                            <div className="w-16 h-16 mb-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
                                {cat.image ? (
                                    <img
                                        src={resolveMediaUrl(categoryData?.meta?.imageBaseUrl, cat.image)}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400 font-semibold">
                                        {cat.name?.[0]}
                                    </span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center line-clamp-2 group-hover:text-teal-600">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
