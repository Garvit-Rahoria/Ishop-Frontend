import { getProducts } from '@/api/api-call'
import BestSellerCard from '@/components/website/global/BestSellerCard'
import { resolveMediaUrl } from '@/utils/media'
import Link from 'next/link'

export default async function SectionThree() {
    const productData = await getProducts({ status: true, limit: 10 })
    const products = productData?.data || []

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">

            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-6 text-sm font-medium">
                    <span className="border-b-2 border-teal-500 pb-1">BEST SELLER</span>
                </div>

                <Link href="/products" className="text-sm text-gray-500 hover:text-teal-500 cursor-pointer">
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.length === 0 ? (
                    <p className="col-span-full text-gray-500 text-sm">No products yet.</p>
                ) : (
                    products.map((product) => (
                        <BestSellerCard
                            key={product._id}
                            href={product.slug ? `/product/${product.slug}` : undefined}
                            image={resolveMediaUrl(productData?.meta?.imageBaseUrl, product.thumbnail)}
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
