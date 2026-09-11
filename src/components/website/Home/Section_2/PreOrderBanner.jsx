import Link from 'next/link'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function PreOrderBanner() {
    const productData = await getProducts({ status: true, is_top: true, limit: 6 })
    const products = productData?.data || []
    const featured =
        products.find((p) => /watch|speaker|headphone|tablet|phone/i.test(p.name || '')) ||
        products[0]

    const imageUrl = featured
        ? resolveMediaUrl(productData?.meta?.imageBaseUrl, featured.thumbnail)
        : null

    return (
        <section className="relative overflow-hidden rounded-xl h-36 md:h-40 bg-teal-600">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={featured?.name || 'Pre order'}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-r from-teal-700/90 via-teal-600/55 to-teal-500/80" />

            <div className="relative z-10 h-full px-6 md:px-10 flex items-center justify-between">
                <div className="text-white">
                    <p className="text-sm font-semibold uppercase tracking-wide">Pre Order</p>
                    <p className="text-xs opacity-90 mt-1">Be the first to own</p>
                    <p className="text-sm font-medium mt-2">
                        From ₹{featured?.final_price ?? 399}
                    </p>
                </div>

                <div className="text-white text-right hidden sm:block max-w-md">
                    <p className="text-xs opacity-90 line-clamp-1">
                        {featured?.name || 'Featured Product'}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold mt-1 mb-3 leading-tight">
                        A healthy leap ahead
                    </h3>
                    <Link
                        href={featured?.slug ? `/product/${featured.slug}` : '/products'}
                        className="inline-block bg-white text-teal-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                    >
                        Discover Now
                    </Link>
                </div>
            </div>
        </section>
    )
}
