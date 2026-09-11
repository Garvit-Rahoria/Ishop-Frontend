import Link from 'next/link'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function DualPromoBanners() {
    const productData = await getProducts({ status: true, limit: 4 })
    const products = productData?.data || []
    const left = products[0]
    const right = products[1]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative bg-teal-600 rounded-xl p-6 overflow-hidden text-white flex items-center justify-between min-h-[160px]">
                <div className="relative z-10 max-w-[55%]">
                    <p className="text-sm uppercase opacity-90">Featured deal</p>
                    <h3 className="text-xl font-semibold mt-1 line-clamp-2">
                        {left?.name || 'Tech essentials'}
                    </h3>
                    <p className="text-xs opacity-90 mt-1">
                        From ₹{left?.final_price ?? '999'}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block mt-4 bg-white text-teal-700 text-sm font-semibold px-4 py-2 rounded-full"
                    >
                        Shop Now
                    </Link>
                </div>
                {left?.thumbnail ? (
                    <img
                        src={resolveMediaUrl(productData?.meta?.imageBaseUrl, left.thumbnail)}
                        alt={left.name}
                        className="absolute right-2 bottom-2 w-36 h-36 object-contain drop-shadow-lg"
                    />
                ) : null}
            </div>

            <div className="relative bg-neutral-900 rounded-xl overflow-hidden flex items-center min-h-[160px] p-6 text-white">
                <div className="relative z-10 max-w-[55%]">
                    <p className="text-sm uppercase text-teal-300">Hot pick</p>
                    <h3 className="text-xl font-semibold mt-1 line-clamp-2">
                        {right?.name || 'Discover more'}
                    </h3>
                    <p className="text-xs text-white/70 mt-1">
                        From ₹{right?.final_price ?? '1,499'}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block mt-4 bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-full"
                    >
                        Explore
                    </Link>
                </div>
                {right?.thumbnail ? (
                    <img
                        src={resolveMediaUrl(productData?.meta?.imageBaseUrl, right.thumbnail)}
                        alt={right.name}
                        className="absolute right-2 bottom-2 w-36 h-36 object-contain opacity-90"
                    />
                ) : null}
            </div>
        </div>
    )
}
