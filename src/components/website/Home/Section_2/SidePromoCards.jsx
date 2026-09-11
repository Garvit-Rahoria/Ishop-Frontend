import Link from 'next/link'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function SidePromoCards() {
    const productData = await getProducts({ status: true, limit: 12 })
    const products = productData?.data || []

    // Skip the first (often used in deals) and take next 3 with images
    const promos = products
        .filter((p) => p.thumbnail)
        .slice(1, 4)

    if (promos.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="rounded-xl bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-sm"
                    >
                        Promo {i}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {promos.map((product) => {
                const imageUrl = resolveMediaUrl(
                    productData?.meta?.imageBaseUrl,
                    product.thumbnail
                )
                const save = Math.max(
                    0,
                    Math.round((product.orginal_price || 0) - (product.final_price || 0))
                )

                return (
                    <Link
                        key={product._id}
                        href={product.slug ? `/product/${product.slug}` : '/products'}
                        className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-video block shadow-sm"
                    >
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                            <p className="text-xs font-medium opacity-90 line-clamp-1">
                                {product.name}
                            </p>
                            <div className="flex items-center justify-between mt-1 gap-2">
                                <span className="text-sm font-bold">₹{product.final_price}</span>
                                {save > 0 ? (
                                    <span className="text-[10px] bg-teal-500 px-2 py-0.5 rounded-full font-semibold">
                                        SAVE ₹{save}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
