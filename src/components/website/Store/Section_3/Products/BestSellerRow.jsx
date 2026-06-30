import { getProducts } from "@/api/api-call";
import ProductCard from "./ProductCard";

const BestSellerRow = async ({ params }) => {

    // console.log(params)
    const sort = params?.sort || null;
    const max_price = params?.max_price || null
    const min_price = params.min_price || null
    const brand_slug = params?.brand_slug || null;
    const color_slug = params?.color_slug || null;
    // console.log(brand_slug)

    const product_response = await getProducts({ status: true, brand_slug, color_slug, sort, max_price, min_price })


    return (
        <div>
            <h3 className="font-semibold mb-4">
                BEST SELLER IN THIS CATEGORY
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                            user={null} />
                    )
                })}
            </div>
        </div>
    );
};

export default BestSellerRow;
