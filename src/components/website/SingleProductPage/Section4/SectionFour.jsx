import BestSellerCard from "@/components/website/global/BestSellerCard";

const SectionFour = () => {
    const relatedProducts = [
        {
            image: "/phone-1.png",
            title: "SROK Smart Phone 128GB, Oled Retina",
            price: 579,
            oldPrice: 859,
            save: 199,
            badges: ["FREE SHIPPING"],
            stockStatus: "In stock",
            variants: ["/v1.png", "/v2.png"],
        },
        {
            image: "/tablet-1.png",
            title: "aPod Pro Tablet 2023 LTE + Wifi, GPS Cellular 12.9 Inch, 512GB",
            price: "979.00 - 1,259.00",
            badges: ["$2.98 SHIPPING"],
            stockStatus: "In stock",
        },
        {
            image: "/phone-2.png",
            title: "OPod Pro 12.9 inch M1 2023, 64GB + Wifi, GPS",
            price: 569,
            badges: ["FREE SHIPPING", "FREE GIFT"],
            stockStatus: "In stock",
        },
        {
            image: "/phone-3.png",
            title: "Xiaomi Redmi Note 5, 64GB",
            price: 1239,
            oldPrice: 1619,
            save: 59,
            badges: ["FREE SHIPPING"],
            stockStatus: "Contact",
        },
        {
            image: "/tablet-2.png",
            title: "Microsute Alpha Ultra S5 Surface 128GB 2022, Silver",
            price: 1729,
            badges: ["FREE SHIPPING"],
            stockStatus: "Contact",
        },
    ];

    return (
        <section className="bg-white py-10 mt-4">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold">
                        RELATED PRODUCTS
                    </h3>

                    {/* arrows UI only */}
                    <div className="flex gap-2">
                        <button className="w-8 h-8 border rounded flex items-center justify-center">
                            ‹
                        </button>
                        <button className="w-8 h-8 border rounded flex items-center justify-center">
                            ›
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {relatedProducts.map((item, index) => (
                        <BestSellerCard
                            key={index}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            oldPrice={item.oldPrice}
                            save={item.save}
                            badges={item.badges}
                            stockStatus={item.stockStatus}
                            variants={item.variants}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SectionFour;
