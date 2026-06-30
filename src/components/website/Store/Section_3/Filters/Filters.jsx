// "use client"
import { getBrands, getCategories, getColors } from "@/api/api-call";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import Link from "next/link";


const Filters = async () => {

    const [category_reponse, color_reponse, brand_reponse] = await Promise.all([
        getCategories({ status: true }),
        getColors({ status: true }),
        getBrands({ status: true })
    ])

    const categories = category_reponse?.data || []
    const colors = color_reponse.data || []
    const brands = brand_reponse.data || []



    const filterData = {


        rating: ["(52)", "(24)", "(5)", "(1)"],

        screenSize: [
            '7" & Under',
            '7.1" - 8.9"',
            '9" - 10.9"',
            '11" & Greater',
        ],


        memory: [
            "12GB (4)",
            "8GB (3)",
            "6GB (12)",
            "4GB (6)",
            "3GB (7)",
            "1.5GB (1)",
            "1GB (1)",
            "512MB (2)",
        ],

        conditions: ["New (21)", "Like New (2)", "Open Box (38)"],
    };



    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold ml-2 ">Filters~</h2>
                <Link href={"/products"}>
                    <button className="mr-2 text-sm underline hover:text-red-500 cursor-pointer">Clear All</button>
                </Link>
            </div>
            <div className="bg-[#f3f4f8] rounded-xl p-5 text-sm space-y-6">

                {/* CATEGORIES */}
                <CategoryFilter categories={categories} />

                <hr />

                {/* BY BRAND */}
                <BrandFilter brands={brands} />

                <hr />

                {/* BY PRICE */}
                <PriceFilter />

                <hr />


                {/* BY COLOR */}

                <ColorFilter colors={colors} />

                <hr />

                {/* BY RATING */}
                <div>
                    <h4 className="font-semibold mb-3">BY RATING</h4>

                    <div className="space-y-2 text-gray-600">
                        {filterData.rating.map((r) => (
                            <label key={r} className="flex items-center gap-2">
                                <input type="checkbox" />
                                {r}
                            </label>
                        ))}
                    </div>
                </div>

                <hr />

                {/* BY SCREEN SIZE */}
                <div>
                    <h4 className="font-semibold mb-3">BY SCREEN SIZE</h4>

                    <div className="flex flex-wrap gap-2">
                        {filterData.screenSize.map((size) => (
                            <button
                                key={size}
                                className="bg-white border px-3 py-1 rounded text-xs hover:border-green-500"
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <hr />

                {/* BY MEMORY */}
                <div>
                    <h4 className="font-semibold mb-3">BY MEMORY</h4>

                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                        {filterData.memory.map((m) => (
                            <label key={m} className="flex items-center gap-2">
                                <input type="checkbox" />
                                {m}
                            </label>
                        ))}
                    </div>
                </div>

                <hr />

                {/* BY CONDITIONS */}
                <div>
                    <h4 className="font-semibold mb-3">BY CONDITIONS</h4>

                    <div className="space-y-2 text-gray-600">
                        {filterData.conditions.map((c) => (
                            <label key={c} className="flex items-center gap-2">
                                <input type="checkbox" />
                                {c}
                            </label>
                        ))}
                    </div>
                </div>

                <hr />

                {/* PROMO CARD */}
                <div className="bg-black text-white rounded-xl p-4">
                    <h4 className="font-semibold mb-1">OKOdo hero 11+</h4>
                    <p className="text-xs opacity-80 mb-2">5K wireless</p>
                    <p className="text-green-400 text-lg font-bold">$169</p>
                </div>

            </div>
        </>
    );
};

export default Filters;
