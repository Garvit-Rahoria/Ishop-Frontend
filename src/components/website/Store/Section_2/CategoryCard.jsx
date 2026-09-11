import { getCategories } from "@/api/api-call";
import { resolveMediaUrl } from "@/utils/media";

const CategoryCard = async ({image,name,items}) => {

    const categoryData = await getCategories({ limit: 6, is_top: true, status: true });

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-md">
                <img
                    src={resolveMediaUrl(categoryData?.meta?.imageBaseUrl, image)}
                    alt={name || "category"}
                    className="h-10 object-contain"
                />
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-900">
                    {name}
                </h4>
                <p className="text-xs text-gray-500">
                    {items || "2 Items"}
                </p>
            </div>
        </div>
    );
};

export default CategoryCard;
