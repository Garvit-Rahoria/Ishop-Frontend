const ProductInfo = () => {
    return (
        <div className="space-y-5 text-sm">

            <h1 className="text-lg font-semibold leading-snug">
                Somseng Galatero X6 Ultra LTE 4G/128GB, Black Smartphone
            </h1>

            <p className="text-xl font-bold">
                $569.00 - $609.00
            </p>

            <ul className="list-disc ml-5 text-gray-600 space-y-1">
                <li>Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core</li>
                <li>DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
                <li>Commanding Power Design: Twin 16+1+2 Phases Digital VRM</li>
            </ul>

            <div className="flex gap-2">
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded">
                    FREE SHIPPING
                </span>
                <span className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded">
                    FREE GIFT
                </span>
            </div>

            <hr />

            {/* COLOR */}
            <div>
                <p className="font-medium mb-2">COLOR: <span className="text-gray-500">Midnight Blue</span></p>

                <div className="grid grid-cols-3 gap-3">
                    {["Midnight Blue", "Deep Purple", "Space Black"].map((c) => (
                        <button
                            key={c}
                            className="border rounded-lg p-2 text-xs hover:border-green-500"
                        >
                            {c}
                            <div className="font-semibold mt-1">$569.00</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* MEMORY */}
            <div>
                <p className="font-medium mb-2">MEMORY SIZE: <span className="text-gray-500">128GB</span></p>

                <div className="flex gap-2">
                    {["64GB", "128GB", "256GB", "512GB"].map((m) => (
                        <button
                            key={m}
                            className={`border px-4 py-2 rounded text-xs ${m === "128GB" ? "border-green-500 text-green-600 font-medium" : ""
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROMO */}
            <div className="bg-green-50 rounded-lg p-4 flex gap-4 items-center">
                <img src="/gift.png" className="w-12" />
                <div className="text-xs text-gray-700">
                    <p>Buy <b>02</b> boxes get a <b>Snack Tray</b></p>
                    <p>Buy <b>04</b> boxes get a free <b>Block Toys</b></p>
                    <p className="text-gray-400 mt-1">
                        Promotion expires in: 9h00pm, 25/5/2024
                    </p>
                </div>
            </div>

            <div className="text-xs text-gray-600 space-y-1">
                <p><b>SKU:</b> ABC025168</p>
                <p><b>CATEGORY:</b> Cell Phones & Tablets</p>
                <p><b>BRAND:</b> <span className="text-green-600">sumsong</span></p>
            </div>

        </div>
    );
};

export default ProductInfo;
