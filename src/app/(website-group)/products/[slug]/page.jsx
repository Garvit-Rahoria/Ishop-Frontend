import { getProducts } from "@/api/api-call";
import SectionOne from "@/components/website/Store/Section_1/SectionOne";
import SectionTwo from "@/components/website/Store/Section_2/SectionTwo";
import Filters from "@/components/website/Store/Section_3/Filters/Filters";
import ProductCard from "@/components/website/Store/Section_3/Products/ProductCard";
import ProductsToolbar from "@/components/website/Store/Section_3/Products/ProductsToolbar";


const page = async ({ params, searchParams }) => {


    const search_promise = await searchParams;
    const category_promise = await params;
    // console.log(category_promise)

    const sort = search_promise?.sort || null;
    const max_price = search_promise?.max_price || null
    const min_price = search_promise?.min_price || null
    const color_slug = search_promise?.color_slug || null
    const brand_slug = search_promise?.brand_slug || null;
    const category_slug = category_promise.slug || null;

    // console.log(brand_slug)
    // console.log(category_slug)

    const product_response = await getProducts({ status: true, category_slug, brand_slug, color_slug, min_price, max_price, sort })


    return (
        <>
            {/* <SectionOne/> */}
            {/* <SectionTwo/> */}



            <section className="bg-white py-10">

                <div className="max-w-7xl mx-auto px-4">

                    <div className="grid grid-cols-12 gap-6">

                        {/* LEFT FILTERS */}
                        <aside className="col-span-12 lg:col-span-3">
                            <Filters />
                        </aside>

                        {/* RIGHT CONTENT */}

                        <main className="col-span-12 lg:col-span-9">
                            <div className="mb-7">
                                <ProductsToolbar />
                            </div>
            
                            {/* PRODUCT GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                                {product_response?.data.map((product) => {
                                    const imageBaseUrl = `${product_response?.meta?.imageBaseUrl}/${product.thumbnail}`

                                    return (

                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            name={product.name}
                                            orginal_price={product.orginal_price}
                                            discount_percentage={product.discount_percentage}
                                            final_price={product.final_price}
                                            imageBaseUrl={imageBaseUrl}
                                            user={null}
                                        />
                                    )
                                })}

                            </div>
                        </main>

                    </div>

                </div>
            </section>
        </>
    );
};


export default page;
