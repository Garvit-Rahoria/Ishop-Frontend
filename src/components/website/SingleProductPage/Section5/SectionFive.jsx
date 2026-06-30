import BestSellerCard from "@/components/website/global/BestSellerCard";

const SectionFive = () => {
    const recentlyViewed = [
        {
            image: "/watch.png",
            title: "Xomie Remid 8 Sport Water Resistance Watch",
            price: 579,
            badges: ["NEW"],
        },
        {
            image: "/laptop.png",
            title: "Microte Surface 2.0 Laptop",
            price: 979,
            badges: ["NEW"],
        },
        {
            image: "/tablet.png",
            title: "aPod Pro Tablet 2023 LTE + Wifi, GPS Cellular 12.9 Inch, 512GB",
            price: "979.00 - 1,259.00",
        },
        {
            image: "/phone-1.png",
            title: "SROK Smart Phone 128GB, Oled Retina",
            price: 579,
            oldPrice: 779,
            save: 192,
        },
    ];

    return (
        <section className="bg-white py-10 mt-4">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-semibold">
                        YOUR RECENTLY VIEWED
                    </h3>

                    <div className="flex items-center gap-4">
                        <button className="text-xs text-gray-500 hover:text-black">
                            View All
                        </button>

                        {/* arrows – UI only */}
                        <div className="flex gap-2">
                            <button className="w-8 h-8 border rounded flex items-center justify-center">
                                ‹
                            </button>
                            <button className="w-8 h-8 border rounded flex items-center justify-center">
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recentlyViewed.map((item, index) => (
                        <BestSellerCard
                            key={index}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                            oldPrice={item.oldPrice}
                            save={item.save}
                            badges={item.badges}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default SectionFive;
