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
        getBrands({ status: true }),
    ]);

    const categories = category_reponse?.data || [];
    const colors = color_reponse?.data || [];
    const brands = brand_reponse?.data || [];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold ml-2">Filters</h2>
                <Link
                    href="/products"
                    className="mr-2 text-sm underline hover:text-red-500"
                >
                    Clear All
                </Link>
            </div>
            <div className="bg-[#f3f4f8] rounded-xl p-5 text-sm space-y-6">
                <CategoryFilter categories={categories} />
                <hr />
                <BrandFilter brands={brands} />
                <hr />
                <PriceFilter />
                <hr />
                <ColorFilter colors={colors} />
            </div>
        </>
    );
};

export default Filters;
