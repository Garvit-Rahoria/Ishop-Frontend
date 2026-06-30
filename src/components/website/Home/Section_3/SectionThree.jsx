import BestSellerCard from '@/components/website/global/BestSellerCard'

export default function SectionThree() {

    const products = [
        {
            image: '/products/headphone.png',
            title: 'BOSO 2 Wireless On Ear Headphone',
            price: 359,
            badges: ['FREE SHIPPING', 'FREE GIFT'],
            stockStatus: 'In stock',
            variants: [
                '/products/headphone.png',
                '/products/headphone-black.png',
            ],
        },
        {
            image: '/products/headphone.png',
            title: 'OPod Pro 12.9 Inch M1 2023, 64GB + Wifi, GPS',
            price: 569,
            oldPrice: 759,
            save: 199,
            badges: ['FREE SHIPPING'],
            stockStatus: 'In stock',
        },
        {
            image: '/products/headphone.png',
            title: 'uLosk Mini case 2.0, Xenon i10 / 32GB / SSD 512GB / VGA 8GB',
            price: 1729,
            oldPrice: 2119,
            badges: ['FREE SHIPPING'],
            stockStatus: 'Out of stock',
        },
        {
            image: '/products/headphone.png',
            title: 'Oppo Watch Series 8 GPS + Cellular Stainless Steel',
            price: '979 - 1,259',
            stockStatus: 'PRE ORDER',
        },
        {
            image: '/products/headphone.png',
            title: 'iSmart 24V Charger',
            price: 9,
            oldPrice: 12,
            stockStatus: 'Contact',
        },
    ]

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-6 text-sm font-medium">
                    <button className="border-b-2 border-teal-500 pb-1">
                        BEST SELLER
                    </button>
                    <button className="text-gray-400">NEW IN</button>
                    <button className="text-gray-400">POPULAR</button>
                </div>

                <span className="text-sm text-gray-500 hover:text-teal-500 cursor-pointer">
                    View All
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map((product, index) => (
                    <BestSellerCard key={index} {...product} />
                ))}
            </div>

        </section>
    )
}
