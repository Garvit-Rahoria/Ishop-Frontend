import Link from 'next/link'
import CategoryPromoBanner from './CategoryPromoBanner'
import CategoryQuickLinks from './CategoryQuickLinks'
import BestSellerCard from '@/components/website/global/BestSellerCard'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function SectionFour() {
    const productData = await getProducts({ status: true, limit: 10 })
    const products = (productData?.data || []).slice(0, 5)

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    TOP CELLPHONES &amp; TABLETS
                </h3>
                <Link
                    href="/products"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <CategoryPromoBanner />
                <div className="lg:col-span-2">
                    <CategoryQuickLinks />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.length === 0 ? (
                    <p className="col-span-full text-sm text-gray-400">No products yet</p>
                ) : (
                    products.map((product) => (
                        <BestSellerCard key={product._id} product={product}
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
                    ))
                )}
            </div>
        </section>
    )
}
