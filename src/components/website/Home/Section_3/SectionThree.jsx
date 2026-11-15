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
                <div className="flex gap-6 text-sm font-bold tracking-wider">
                    <span className="border-b-2 border-teal-500 pb-1 text-slate-900 dark:text-slate-100 uppercase">
                        BEST SELLER
                    </span>
                </div>

                <Link
                    href="/products"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
                >
                    View All
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.length === 0 ? (
                    <p className="col-span-full text-gray-500 text-sm">No products yet.</p>
                ) : (
                    products.map((product) => (
                        <BestSellerCard key={product._id} product={product}
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
