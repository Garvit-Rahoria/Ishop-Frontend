import Link from "next/link";
import { resolveMediaUrl } from "@/utils/media";

const CategoryCard = ({ image, name, slug, count = 0, imageBaseUrl = "" }) => {
    return (
        <Link
            href={slug ? `/products/${slug}` : "/products"}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-700/80 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-sm transition cursor-pointer bg-white dark:bg-slate-800 group"
        >
            <div className="w-14 h-14 flex items-center justify-center bg-gray-50 dark:bg-slate-900 rounded-lg shrink-0 group-hover:scale-105 transition">
                <img
                    src={resolveMediaUrl(imageBaseUrl, image)}
                    alt={name || "category"}
                    className="w-10 h-10 object-contain"
                />
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                    {name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                    {count} {count === 1 ? "Product" : "Products"}
                </p>
            </div>
        </Link>
    );
};

export default CategoryCard;
