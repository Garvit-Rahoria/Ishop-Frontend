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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden h-full transition-colors">
            <div className="bg-teal-600 px-6 py-4">
                <h3 className="text-white font-bold text-base sm:text-lg tracking-wide">
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
                                className="w-14 h-14 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center"
                            >
                                <img
                                    src={src}
                                    alt={`${deal.name} thumb ${i + 1}`}
                                    className="w-full h-full object-contain p-1"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="relative flex-1 min-h-[240px] rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                        {saveAmount > 0 ? (
                            <span className="absolute top-3 left-3 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                                SAVE ₹{saveAmount.toLocaleString('en-IN')}
                            </span>
                        ) : null}

                        <img
                            src={imageUrl}
                            alt={deal.name}
                            className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-2xs"
                        />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-col">
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
                        {deal.brandId?.name || 'Featured Deal'}
                    </p>

                    <Link href={deal.slug ? `/product/${deal.slug}` : '/products'}>
                        <h4 className="font-extrabold text-slate-900 dark:text-slate-100 mb-3 text-lg leading-snug hover:text-teal-600 dark:hover:text-teal-400 transition line-clamp-2">
                            {deal.name}
                        </h4>
                    </Link>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-teal-600 dark:text-teal-400 text-2xl font-black">
                            ₹{Number(deal.final_price || 0).toLocaleString('en-IN')}
                        </span>
                        {deal.orginal_price > deal.final_price ? (
                            <span className="line-through text-slate-400 dark:text-slate-500 text-sm font-medium">
                                ₹{Number(deal.orginal_price || 0).toLocaleString('en-IN')}
                            </span>
                        ) : null}
                        {deal.discount_percentage ? (
                            <span className="text-xs font-extrabold text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 px-2.5 py-1 rounded-full">
                                -{deal.discount_percentage}%
                            </span>
                        ) : null}
                    </div>

                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-4 font-normal">
                        {(points.length > 0
                            ? points
                            : [
                                  'Limited time offer with manufacturer warranty',
                                  'Secure checkout & fast express delivery',
                                  deal.stock ? 'In stock — ready to dispatch' : 'Limited stock',
                              ]
                        ).map((point, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-teal-500 font-bold">•</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-5">
                        <span className="text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50 px-3 py-1 rounded-full font-bold">
                            FREE SHIPPING
                        </span>
                        {deal.stock ? (
                            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 px-3 py-1 rounded-full font-bold">
                                IN STOCK
                            </span>
                        ) : null}
                    </div>

                    <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300">
                            HURRY UP! PROMOTION WILL EXPIRE IN
                        </p>
                        <DealCountdown hoursFromNow={18} />
                    </div>

                    <div className="mt-auto">
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${Math.min(90, 30 + (deal.discount_percentage || 10))}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                            <p className="text-slate-600 dark:text-slate-400">
                                Sold:{' '}
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {Math.min(74, 20 + Math.round((deal.discount_percentage || 5) * 2))}
                                    /75
                                </span>
                            </p>
                            <Link
                                href="/products"
                                className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
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
