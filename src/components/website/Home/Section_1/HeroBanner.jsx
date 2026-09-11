import Link from 'next/link'
import Image from 'next/image'

export default function HeroBanner() {
    return (
        <div className="lg:col-span-3 relative overflow-hidden rounded-xl bg-gray-100 min-h-[280px] md:min-h-[360px]">
            <Image
                src="https://www.shutterstock.com/image-photo/create-banner-gadget-store-flat-260nw-2553356023.jpg"
                alt="Electronics Banner"
                fill
                className="object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="relative z-10 h-full flex items-center min-h-[280px] md:min-h-[360px]">
                <div className="px-6 md:px-10 max-w-lg text-white">
                    <span className="inline-block mb-3 text-sm font-medium bg-teal-500 px-3 py-1 rounded-full">
                        New Arrival
                    </span>

                    <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                        Discover the <br /> Latest Tech Products
                    </h1>

                    <p className="text-sm md:text-base mb-6 text-gray-200">
                        Upgrade your lifestyle with premium electronics at unbeatable prices.
                    </p>

                    <Link
                        href="/products"
                        className="inline-block bg-teal-500 hover:bg-teal-600 transition px-6 py-3 rounded-full text-sm font-semibold"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    )
}
