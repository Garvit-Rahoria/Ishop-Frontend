import { getProducts } from "@/api/api-call";
import ProductCard from "./ProductCard";
import { resolveMediaUrl } from "@/utils/media";
import ProductsToolbar from "./ProductsToolbar";
import Pagination from "./Pagination";

const BestSellerRow = async ({ params }) => {
    const sort = params?.sort || null;
    const max_price = params?.max_price || null;
    const min_price = params?.min_price || null;
    const brand_slug = params?.brand_slug || null;
    const color_slug = params?.color_slug || null;
    const category_slug = params?.category_slug || null;
    const q = params?.q || null;
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 9;

    const product_response = await getProducts({
        status: true,
        brand_slug,
        color_slug,
        category_slug,
        sort,
        max_price,
        min_price,
        q,
        page,
        limit,
    });

    const products = product_response?.data || [];
    const meta = product_response?.meta || {};
    const total = meta.total || 0;
    const pages = meta.pages || 0;

    return (
        <div className="space-y-6">
            <ProductsToolbar
                total={total}
                page={page}
                limit={limit}
                q={q}
            />

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {q ? `Search results for “${q}”` : "All Products"}
            </h3>

            {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-16 text-center">
                    <p className="text-slate-800 dark:text-slate-200 font-bold mb-1">No products found</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting filters or search terms.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const imageBaseUrl = resolveMediaUrl(
                            product_response?.meta?.imageBaseUrl,
                            product.thumbnail
                        );
                        return (
                            <ProductCard
                                key={product._id}
                                product={product}
                                name={product.name}
                                orginal_price={product.orginal_price}
                                discount_percentage={product.discount_percentage}
                                final_price={product.final_price}
                                imageBaseUrl={imageBaseUrl}
                            />
                        );
                    })}
                </div>
            )}

            <Pagination page={page} pages={pages} />
        </div>
    );
};

export default BestSellerRow;
