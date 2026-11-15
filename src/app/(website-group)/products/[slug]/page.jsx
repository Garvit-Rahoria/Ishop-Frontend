import { getProducts } from "@/api/api-call";
import Filters from "@/components/website/Store/Section_3/Filters/Filters";
import ProductCard from "@/components/website/Store/Section_3/Products/ProductCard";
import ProductsToolbar from "@/components/website/Store/Section_3/Products/ProductsToolbar";
import Pagination from "@/components/website/Store/Section_3/Products/Pagination";
import Breadcrumb from "@/components/website/global/Breadcrumb";
import { resolveMediaUrl } from "@/utils/media";

export const dynamic = "force-dynamic";

const page = async ({ params, searchParams }) => {
    const search_promise = await searchParams;
    const category_promise = await params;

    const sort = search_promise?.sort || null;
    const max_price = search_promise?.max_price || null;
    const min_price = search_promise?.min_price || null;
    const color_slug = search_promise?.color_slug || null;
    const brand_slug = search_promise?.brand_slug || null;
    const q = search_promise?.q || null;
    const pageNum = Number(search_promise?.page) || 1;
    const limit = Number(search_promise?.limit) || 9;
    const category_slug = category_promise.slug || null;

    const product_response = await getProducts({
        status: true,
        category_slug,
        brand_slug,
        color_slug,
        min_price,
        max_price,
        sort,
        q,
        page: pageNum,
        limit,
    });

    const products = product_response?.data || [];
    const meta = product_response?.meta || {};
    const total = meta.total || 0;
    const pages = meta.pages || 0;
    const categoryTitle = category_slug
        ? category_slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Category Products';

    return (
        <section className="bg-slate-50/50 dark:bg-[#0b1120] py-8 md:py-10 transition-colors duration-200 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                <Breadcrumb
                    items={[
                        { label: 'Home', href: '/' },
                        { label: 'Products', href: '/products' },
                        { label: categoryTitle, href: null },
                    ]}
                />

                <div className="grid grid-cols-12 gap-8">
                    <aside className="col-span-12 lg:col-span-3">
                        <Filters />
                    </aside>

                    <main className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                                {categoryTitle}
                            </h1>
                        </div>

                        <ProductsToolbar
                            total={total}
                            page={pageNum}
                            limit={limit}
                            q={q}
                        />

                        {products.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-16 text-center">
                                <p className="text-slate-800 dark:text-slate-200 font-bold mb-1">
                                    No products in this category
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Try clearing filters or browse all products.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                            discount_percentage={
                                                product.discount_percentage
                                            }
                                            final_price={product.final_price}
                                            imageBaseUrl={imageBaseUrl}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <Pagination page={pageNum} pages={pages} />
                    </main>
                </div>
            </div>
        </section>
    );
};

export default page;
