import { getBrands } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'
import Link from 'next/link'

export default async function FeaturedBrands() {
    const brandData = await getBrands({ status: true, is_popular: true, limit: 10 })
    const brands = brandData?.data || []

    return (
        <div className="bg-white rounded-xl shadow-sm p-5 h-full">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-800">Featured Brands</h3>
                <Link
                    href="/products"
                    className="text-sm text-gray-500 hover:text-teal-500 transition"
                >
                    View All
                </Link>
            </div>

            {brands.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No brands yet</p>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {brands.map((brd) => (
                        <Link
                            key={brd._id}
                            href={`/products?brand_slug=${brd.slug}`}
                            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3 hover:border-teal-200 hover:bg-teal-50/40 transition"
                        >
                            <div className="w-full aspect-square max-h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white">
                                {brd?.image ? (
                                    <img
                                        src={resolveMediaUrl(brandData?.meta?.imageBaseUrl, brd.image)}
                                        alt={brd.name}
                                        className="max-h-full max-w-full object-contain p-1"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">{brd.name?.[0]}</span>
                                )}
                            </div>
                            <span className="text-[11px] font-medium text-gray-600 text-center line-clamp-1 group-hover:text-teal-600">
                                {brd.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
