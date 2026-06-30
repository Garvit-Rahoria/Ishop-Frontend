const BundleProducts = () => {
    return (
        <div className="border rounded-xl p-6">

            {/* TITLE */}
            <h3 className="text-sm font-semibold mb-6">
                FREQUENTLY BOUGHT TOGETHER
            </h3>

            {/* PRODUCTS ROW */}
            <div className="flex flex-wrap items-center gap-6 mb-6">

                {/* Product 1 */}
                <img
                    src="/phone-main.png"
                    className="h-28 object-contain"
                    alt="Phone"
                />

                <span className="text-xl font-semibold">+</span>

                {/* Product 2 */}
                <img
                    src="/headphone.png"
                    className="h-24 object-contain"
                    alt="Headphone"
                />

                <span className="text-xl font-semibold">+</span>

                {/* Product 3 */}
                <img
                    src="/watch.png"
                    className="h-24 object-contain opacity-40"
                    alt="Watch"
                />

                {/* PRICE BOX */}
                <div className="ml-auto text-right">
                    <p className="text-xs text-gray-500">TOTAL PRICE:</p>
                    <p className="text-2xl font-bold">$609.00</p>

                    <button className="mt-3 bg-teal-600 text-white px-6 py-2 rounded-lg text-sm">
                        ADD TO CART
                    </button>

                    <p className="text-xs text-gray-500 mt-2 cursor-pointer">
                        ♡ Add all to Wishlist
                    </p>
                </div>

            </div>

            {/* CHECKLIST */}
            <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly />
                    <span>
                        This item: Somseng Galatero X6 Ultra LTE 4G/128 Gb, Black Smartphone
                        <span className="text-red-500 font-medium"> ($569.00)</span>
                    </span>
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>
                        BOSO 2 Wireless On Ear Headphone
                        <span className="text-red-500 font-medium"> ($369.00)</span>
                    </span>
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span>
                        Oppo Watch Series 8 GPS + Cellular Stainless Stell Case with Milanese Loop
                        <span className="text-red-500 font-medium"> ($129.00)</span>
                    </span>
                </label>
            </div>

        </div>
    );
};

export default BundleProducts;
