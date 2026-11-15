import { getProductBySlug } from '@/api/api-call'
import ProductDetailView from '@/components/website/Product/ProductDetailView'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }) {
    const { slug } = await params
    const res = await getProductBySlug(slug)
    const product = res?.data

    if (!product || !product._id) {
        notFound()
    }

    if (product.status === false) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">
                    Product unavailable
                </h1>
                <p className="text-gray-500 dark:text-slate-400 mb-6">
                    This product is currently not listed for sale.
                </p>
                <Link
                    href="/products"
                    className="inline-flex bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 font-semibold transition"
                >
                    Browse products
                </Link>
            </div>
        )
    }

    return (
        <ProductDetailView
            product={product}
            imageBaseUrl={res?.meta?.imageBaseUrl || ''}
        />
    )
}
