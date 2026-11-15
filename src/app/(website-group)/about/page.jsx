export default function AboutPage() {
    return (
        <section className="bg-white dark:bg-[#0b1120] py-14 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="max-w-3xl">
                    <p className="text-teal-600 dark:text-teal-400 font-bold text-xs tracking-wider uppercase mb-3">
                        About Swoo
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-slate-100 mb-5">
                        SWOO TECH MART
                    </h1>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                        We bring you the latest gadgets, electronics, and tech essentials with
                        trusted brands, secure payments, and fast delivery.
                    </p>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-8">
                        From smartphones and laptops to headphones and accessories — shop with
                        free shipping on orders over ₹199, 30-day money back, and 24/7 support.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-teal-50 dark:bg-slate-900 border border-teal-100 dark:border-slate-800 p-5">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-1">Free Shipping</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400">On orders over ₹199</p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 dark:bg-slate-900 border border-teal-100 dark:border-slate-800 p-5">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-1">Secure Payment</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400">100% protected checkout</p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 dark:bg-slate-900 border border-teal-100 dark:border-slate-800 p-5">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-1">24/7 Support</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400">We&apos;re here to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
