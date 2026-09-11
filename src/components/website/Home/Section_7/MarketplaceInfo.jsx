import Link from 'next/link'

export default function MarketplaceInfo() {
    return (
        <div className="bg-gray-100 rounded-xl p-6 md:p-10 mt-8">
            <h3 className="text-lg font-semibold mb-4">
                Swoo Tech Mart — shop smarter
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Browse curated electronics with clear pricing in INR, secure checkout,
                and fast support. From mobiles and laptops to accessories — find what
                you need and order in a few clicks.
            </p>

            <Link
                href="/products"
                className="text-sm font-medium text-teal-600 hover:underline"
            >
                Browse all products
            </Link>
        </div>
    )
}
