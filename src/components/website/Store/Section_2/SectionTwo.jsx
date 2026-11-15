import { getCategories } from "@/api/api-call";
import CategoryCard from "./CategoryCard";

const SectionTwo = async () => {
    const categoryData = await getCategories({ limit: 6, is_top: true, status: true });
    const categories = categoryData?.data || [];
    const imageBaseUrl = categoryData?.meta?.imageBaseUrl || "";

    return (
        <section className="bg-[#f2f3f7] dark:bg-[#0b1120] py-6 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl p-6">
                    {/* Section Title */}
                    <h3 className="text-sm font-bold tracking-wider text-gray-800 dark:text-slate-100 mb-6 uppercase">
                        Popular Categories
                    </h3>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {categories.map((cat, index) => (
                            <CategoryCard
                                key={cat._id || index}
                                image={cat.image}
                                name={cat.name}
                                slug={cat.slug}
                                count={cat.count ?? 0}
                                imageBaseUrl={imageBaseUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SectionTwo;
