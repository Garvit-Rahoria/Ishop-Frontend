import CategoryPromoBanner from './CategoryPromoBanner'
import CategoryQuickLinks from './CategoryQuickLinks'
import BestSellerCard from '@/components/website/global/BestSellerCard'

export default function SectionFour() {

    const products = [
        {
            image: '/products/phone1.png',
            title: 'SROK Smart Phone 128GB, Gold Retina',
            price: 579,
            oldPrice: 859,
            save: 199,
            badges: ['FREE SHIPPING'],
            stockStatus: 'In stock',
        },
        {
            image: '/products/tablet1.png',
            title: 'aPod Pro Tablet 2023 LTE + Wifi, GPS',
            price: '979 - 1,259',
            stockStatus: 'In stock',
        },
        {
            image: '/products/phone2.png',
            title: 'OPod Pro 12.9 Inch M1 2023, 64GB',
            price: 659,
            badges: ['FREE SHIPPING', 'FREE GIFT'],
            stockStatus: 'In stock',
        },
        {
            image: '/products/redmi.png',
            title: 'Xiaomi Redmi Note 5, 64GB',
            price: 1239,
            oldPrice: 1619,
            badges: ['FREE SHIPPING'],
            stockStatus: 'Contact',
        },
        {
            image: '/products/surface.png',
            title: 'Microsoft Alpha Ultra S5 Surface',
            price: 1729,
            badges: ['FREE SHIPPING'],
            stockStatus: 'Contact',
        },
    ]

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                    TOP CELLPHONES & TABLETS
                </h3>
                <span className="text-sm text-gray-500 cursor-pointer hover:text-teal-500">
                    View All
                </span>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <CategoryPromoBanner />
                <div className="lg:col-span-2">
                    <CategoryQuickLinks />
                </div>
            </div>

            {/* Product Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product, index) => (
                    <BestSellerCard key={index} {...product} />
                ))}
            </div>

        </section>
    )
}
