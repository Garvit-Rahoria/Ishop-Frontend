import Link from 'next/link'

export default function LaptopPromoBanner() {
    return (
        <div className="relative min-h-[180px] rounded-xl overflow-hidden bg-neutral-900 text-white p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-2xl font-semibold mb-1 leading-snug">
                    Premium laptops
                    <br />
                    for work &amp; play
                </h3>
                <p className="text-sm opacity-80 mb-3">Powered for everyday performance</p>
                <p className="text-sm">
                    Start from <span className="text-teal-400 font-semibold">₹39,999</span>
                </p>
            </div>
            <Link
                href="/products"
                className="inline-flex w-fit mt-4 bg-white text-black text-sm font-semibold px-4 py-2 rounded-md hover:bg-teal-50 transition"
            >
                SHOP NOW
            </Link>
        </div>
    )
}
