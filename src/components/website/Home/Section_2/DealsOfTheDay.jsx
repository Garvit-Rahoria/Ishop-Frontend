import Link from 'next/link'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'
import DealCountdown from './DealCountdown'

export default async function DealsOfTheDay() {
    const productData = await getProducts({ status: true, is_top: true, limit: 8 })
    let products = productData?.data || []

    if (products.length === 0) {
        const fallback = await getProducts({ status: true, limit: 8 })
        products = fallback?.data || []
    }

    // Pick product with highest discount
    const deal = [...products].sort(
        (a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0)
    )[0]

    if (!deal) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full min-h-[320px] flex items-center justify-center">
                <p className="text-gray-400 text-sm">No deals available right now</p>
            </div>
        )
    }

    const imageUrl = resolveMediaUrl(productData?.meta?.imageBaseUrl, deal.thumbnail)
    const gallery = [deal.thumbnail, ...(deal.image || [])]
        .filter(Boolean)
        .slice(0, 3)
        .map((img) => resolveMediaUrl(productData?.meta?.imageBaseUrl, img))

    // If no gallery extras, repeat main image for thumbs
    while (gallery.length < 3) gallery.push(imageUrl)

    const saveAmount = Math.max(
        0,
        Math.round((deal.orginal_price || 0) - (deal.final_price || 0))
    )
    const points = (deal.short_description || '')
        .split(/[.|•]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full">
            <div className="bg-teal-500 px-6 py-4">
                <h3 className="text-white font-semibold text-lg tracking-wide">
                    DEALS OF THE DAY
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left: Images */}
                <div className="flex gap-4">
                    <div className="flex flex-col gap-3 shrink-0">
                        {gallery.map((src, i) => (
                            <div
                                key={i}
                                className="w-14 h-14 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
                            >
                                <img
                                    src={src}
                                    alt={`${deal.name} thumb ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="relative flex-1 min-h-[240px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        {saveAmount > 0 ? (
                            <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                                SAVE ₹{saveAmount}
                            </span>
                        ) : null}

                        <img
                            src={imageUrl}
                            alt={deal.name}
                            className="absolute inset-0 w-full h-full object-contain p-4"
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-col">
                    <p className="text-sm text-gray-400 mb-1">
                        {deal.brandId?.name || 'Featured Deal'}
                    </p>

                    <Link href={deal.slug ? `/product/${deal.slug}` : '/products'}>
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg leading-snug hover:text-teal-600 transition line-clamp-2">
                            {deal.name}
                        </h4>
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-teal-500 text-2xl font-bold">
                            ₹{deal.final_price}
                        </span>
                        {deal.orginal_price > deal.final_price ? (
                            <span className="line-through text-gray-400 text-sm">
                                ₹{deal.orginal_price}
                            </span>
                        ) : null}
                        {deal.discount_percentage ? (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                -{deal.discount_percentage}%
                            </span>
                        ) : null}
                    </div>

                    <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        {(points.length > 0
                            ? points
                            : [
                                  'Limited time offer',
                                  'Secure checkout & fast delivery',
                                  deal.stock ? 'In stock — order now' : 'Limited stock',
                              ]
                        ).map((point, i) => (
                            <li key={i}>• {point}</li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="text-xs bg-teal-100 text-teal-600 px-3 py-1 rounded-full font-medium">
                            FREE SHIPPING
                        </span>
                        <span className="text-xs bg-teal-100 text-teal-600 px-3 py-1 rounded-full font-medium">
                            FREE GIFT
                        </span>
                        {deal.stock ? (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                IN STOCK
                            </span>
                        ) : null}
                    </div>

                    <div className="mb-5">
                        <p className="text-sm font-medium mb-2 text-gray-700">
                            HURRY UP! PROMOTION WILL EXPIRE IN
                        </p>
                        <DealCountdown hoursFromNow={18} />
                    </div>

                    <div className="mt-auto">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${Math.min(90, 30 + (deal.discount_percentage || 10))}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-gray-600">
                                Sold:{' '}
                                <span className="font-semibold">
                                    {Math.min(74, 20 + Math.round((deal.discount_percentage || 5) * 2))}
                                    /75
                                </span>
                            </p>
                            <Link
                                href="/products"
                                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                            >
                                Shop Now →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
