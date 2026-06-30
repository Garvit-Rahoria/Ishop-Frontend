import Image from 'next/image'

export default function DualPromoBanners() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Left banner */}
            <div className="relative bg-teal-500 rounded-xl p-6 overflow-hidden text-white flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase opacity-90">
                        Massage Chair
                    </p>
                    <h3 className="text-xl font-semibold mt-1">
                        Luxury
                    </h3>
                    <p className="text-xs opacity-90 mt-1">
                        Fuka Relax Full Body Massage Chair
                    </p>

                    <button className="mt-4 bg-white text-teal-600 text-sm px-4 py-2 rounded-full">
                        Shop Now
                    </button>
                </div>

                <div className="relative w-32 h-32">
                    <Image
                        src="/products/chair.png"
                        alt="Massage Chair"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Right banner */}
            <div className="relative bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                    src="/banners/phone-dark.png"
                    alt="Phone Banner"
                    fill
                    className="object-cover"
                />
            </div>

        </div>
    )
}
