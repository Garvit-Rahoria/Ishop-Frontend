import Link from 'next/link'
import LaptopPromoBanner from './LaptopPromoBanner'
import LaptopQuickLinks from './LaptopQuickLinks'
import BestSellerCard from '@/components/website/global/BestSellerCard'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function SectionFive() {
    const productData = await getProducts({ status: true, is_top: true, limit: 8 })
    let products = productData?.data || []
    if (products.length === 0) {
        const fallback = await getProducts({ status: true, limit: 8 })
        products = fallback?.data || []
    }
    products = products.slice(0, 5)

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">TOP LAPTOPS & COMPUTERS</h3>
                <Link
                    href="/products"
                    className="text-sm text-gray-500 hover:text-teal-500"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <LaptopPromoBanner />
                <div className="lg:col-span-2">
                    <LaptopQuickLinks />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product) => (
                    <BestSellerCard
                        key={product._id}
                        href={product.slug ? `/product/${product.slug}` : undefined}
                        image={resolveMediaUrl(
                            productData?.meta?.imageBaseUrl,
                            product.thumbnail
                        )}
                        title={product.name}
                        price={product.final_price}
                        oldPrice={product.orginal_price}
                        save={product.discount_percentage}
                        badges={product.stock ? ['IN STOCK'] : ['OUT OF STOCK']}
                        stockStatus={product.stock ? 'In stock' : 'Out of stock'}
                    />
                ))}
            </div>
        </section>
    )
}
