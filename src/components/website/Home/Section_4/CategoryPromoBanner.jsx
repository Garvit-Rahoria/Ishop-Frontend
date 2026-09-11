import Link from 'next/link'

export default function CategoryPromoBanner() {
    return (
        <div className="relative min-h-[180px] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-teal-800 text-white p-6 flex flex-col justify-between">
            <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-teal-200 mb-2">
                    Featured
                </p>
                <h3 className="text-xl font-semibold mb-2 leading-snug">
                    Latest smartphones
                    <br />&amp; tablets
                </h3>
                <p className="text-sm text-white/75">Rise to the challenge</p>
            </div>
            <Link
                href="/products"
                className="inline-flex w-fit mt-4 bg-white text-slate-900 text-sm font-semibold px-4 py-2 rounded-md hover:bg-teal-50 transition"
            >
                SHOP NOW
            </Link>
        </div>
    )
}
