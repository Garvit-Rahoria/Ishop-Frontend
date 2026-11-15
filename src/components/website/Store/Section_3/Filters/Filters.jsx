import { getBrands, getCategories, getColors } from "@/api/api-call";
import CategoryFilter from "./CategoryFilter";
import BrandFilter from "./BrandFilter";
import ColorFilter from "./ColorFilter";
import PriceFilter from "./PriceFilter";
import Link from "next/link";
import { FiFilter, FiRotateCcw } from "react-icons/fi";

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
        <aside className="w-full">
            <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-teal-600 dark:text-teal-400" size={16} />
                    <h2 className="text-base font-bold text-gray-800 dark:text-slate-100">Filters</h2>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-rose-500 transition"
                >
                    <FiRotateCcw size={12} />
                    <span>Clear All</span>
                </Link>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 text-sm space-y-5 shadow-xs transition-colors duration-200">
                <CategoryFilter categories={categories} />
                <div className="border-t border-gray-200 dark:border-slate-800" />
                <BrandFilter brands={brands} />
                <div className="border-t border-gray-200 dark:border-slate-800" />
                <PriceFilter />
                <div className="border-t border-gray-200 dark:border-slate-800" />
                <ColorFilter colors={colors} />
            </div>
        </aside>
    );
};

export default Filters;
