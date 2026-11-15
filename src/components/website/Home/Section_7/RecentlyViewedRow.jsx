import Link from 'next/link'
import BestSellerCard from '@/components/website/global/BestSellerCard'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function RecentlyViewedRow() {
    const productData = await getProducts({ status: true, limit: 8 })
    const products = (productData?.data || []).slice(0, 4)

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
            <div className="flex justify-between items-center mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">Featured products</h4>
                <Link href="/products" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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
                            badges={['FEATURED']}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
