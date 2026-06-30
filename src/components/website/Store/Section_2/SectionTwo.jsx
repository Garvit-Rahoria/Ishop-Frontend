import { getCategories } from "@/api/api-call";
import CategoryCard from "./CategoryCard";

const SectionTwo = async () => {

    const categoryData = await getCategories({ limit: 6, is_top: true, status: true });
    const categories = categoryData?.data || []

    return (
        <section className="bg-[#f2f3f7] py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-xl p-6">

                    {/* Section Title */}
                    <h3 className="text-sm font-semibold mb-6">
                        POPULAR CATEGORIES
                    </h3>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-4">
                        {categories.map((cat, index) => (
                            <CategoryCard
                                key={index}
                                image={cat.image}
                                name={cat.name}
                                items={cat.items}
                            />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SectionTwo;
