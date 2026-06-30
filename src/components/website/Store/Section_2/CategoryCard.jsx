import { getCategories } from "@/api/api-call";

const CategoryCard = async ({image,name,items}) => {

    const categoryData = await getCategories({ limit: 6, is_top: true, status: true });
    const imageUrl = categoryData?.meta?.imageBaseUrl;

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition cursor-pointer">
            {/* Image */}
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-md">
                <img
                    src={`${imageUrl}/${image}`}
                    alt="apple"
                    className="h-10 object-contain"
                />
            </div>

            {/* Text */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900">
                    {name}
                </h4>
                <p className="text-xs text-gray-500">
                    2 Items
                </p>
            </div>
        </div>
    );
};

export default CategoryCard;
