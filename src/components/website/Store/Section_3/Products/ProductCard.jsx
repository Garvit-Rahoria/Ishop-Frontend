

import AddToCartButton from "./AddToCartButton";

const ProductCard = async ({ product, imageBaseUrl, name, orginal_price, discount_percentage, final_price }) => {
    // console.log(imageBaseUrl)
    return (
        <div className="relative bg-gray-200 rounded-xl p-4 hover:shadow-md transition">



            {discount_percentage && (
                <span
                    className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded z-10"
                >
                    {discount_percentage}% OFF
                </span>
            )}

            {/* Image */}
            <img
                src={
                    imageBaseUrl}
                alt={name}
                className="h-40 mx-auto rounded-2xl object-contain mb-4"
            />

            {/* Title */}
            <h3 className="text-sm font-medium mb-1">
                {name}
            </h3>

            {/* Price */}
            <div className="text-sm">
                <span className="text-red-500 font-semibold">
                    ₹{final_price}
                </span>

                {orginal_price && (
                    <span className="line-through text-gray-400 ml-2">
                        ₹{orginal_price}
                    </span>
                )}
            </div>

            {/* button */}
            <AddToCartButton product={product} imageBaseUrl={imageBaseUrl} />

        </div>
    );
};

export default ProductCard;
