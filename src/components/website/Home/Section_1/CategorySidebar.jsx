import { getCategories } from '@/api/api-call'
import Link from 'next/link';
import { resolveMediaUrl } from '@/utils/media'

export default async function CategorySidebar() {
    const categorydata = await getCategories({ status: true, is_home: true, limit: 5, })
    const categories = categorydata.data || []
    return (
        <aside className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Category</h3>
            <ul className="space-y-3">
                {categories.map((cat, index) => (
                    <li key={cat._id || index}>
                        <Link
                            href={`/products/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-3 rounded-lg border hover:border-teal-500 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={resolveMediaUrl(categorydata?.meta?.imageBaseUrl, cat.image)}
                                    alt={cat.name}
                                    className="w-6 h-6 rounded-md object-cover"
                                />
                                <span className="text-sm font-medium">
                                    {cat.name}
                                </span>
                            </div>

                            <span className="text-xs bg-teal-100 text-teal-600 w-6 h-6 flex items-center justify-center rounded-full">
                                {cat.count || 0}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
