import Link from 'next/link'
import BestSellerCard from '@/components/website/global/BestSellerCard'
import { getProducts } from '@/api/api-call'
import { resolveMediaUrl } from '@/utils/media'

export default async function RecentlyViewedRow() {
    const productData = await getProducts({ status: true, limit: 8 })
    const products = (productData?.data || []).slice(0, 4)

    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold uppercase">Featured products</h4>
                <Link href="/products" className="text-sm text-gray-500 hover:text-teal-500">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <p className="col-span-full text-sm text-gray-400">No products yet</p>
                ) : (
                    products.map((product) => (
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
                            badges={['FEATURED']}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
