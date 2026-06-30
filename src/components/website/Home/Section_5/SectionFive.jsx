import LaptopPromoBanner from './LaptopPromoBanner'
import LaptopQuickLinks from './LaptopQuickLinks'
import BestSellerCard from '@/components/website/global/BestSellerCard'

export default function SectionFive() {

    const products = [
        {
            image: '/products/macbook.png',
            title: 'Pineapple Macbook Pro 2022 M1 / 512 GB',
            price: 579,
            badges: ['FREE SHIPPING'],
            stockStatus: 'In stock',
        },
        {
            image: '/products/speaker.png',
            title: 'C&O Bluetooth Speaker',
            price: 979,
            badges: ['FREE SHIPPING'],
            stockStatus: 'In stock',
            variants: ['/products/speaker.png', '/products/speaker-black.png'],
        },
        {
            image: '/products/case.png',
            title: 'Gigaby Customo Case, i7 / 16GB / SSD 256GB',
            price: 1259,
            badges: ['FREE SHIPPING', 'FREE GIFT'],
            stockStatus: 'In stock',
        },
        {
            image: '/products/pc-case.png',
            title: 'BEOS PC Gaming Case',
            price: 1239,
            oldPrice: 1619,
            save: 59,
            stockStatus: 'Contact',
        },
        {
            image: '/products/imac.png',
            title: 'aMac All-in-one Computer M1',
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
                    BEST LAPTOPS & COMPUTERS
                </h3>
                <span className="text-sm text-gray-500 hover:text-teal-500 cursor-pointer">
                    View All
                </span>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <LaptopPromoBanner />
                <div className="lg:col-span-2">
                    <LaptopQuickLinks />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product, index) => (
                    <BestSellerCard key={index} {...product} />
                ))}
            </div>

        </section>
    )
}
