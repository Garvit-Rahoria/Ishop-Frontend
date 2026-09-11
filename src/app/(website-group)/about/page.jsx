export default function AboutPage() {
    return (
        <section className="bg-white py-14">
            <div className="max-w-7xl mx-auto px-4">
                <div className="max-w-3xl">
                    <p className="text-teal-500 font-semibold text-sm tracking-wide uppercase mb-3">
                        About Swoo
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                        SWOO TECH MART
                    </h1>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        We bring you the latest gadgets, electronics, and tech essentials with
                        trusted brands, secure payments, and fast delivery.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        From smartphones and laptops to headphones and accessories — shop with
                        free shipping on orders over $199, 30-day money back, and 24/7 support.
                    </p>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-teal-50 p-5">
                            <h3 className="font-semibold text-gray-800 mb-1">Free Shipping</h3>
                            <p className="text-sm text-gray-500">On orders over $199</p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 p-5">
                            <h3 className="font-semibold text-gray-800 mb-1">Secure Payment</h3>
                            <p className="text-sm text-gray-500">100% protected checkout</p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 p-5">
                            <h3 className="font-semibold text-gray-800 mb-1">24/7 Support</h3>
                            <p className="text-sm text-gray-500">We&apos;re here to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
