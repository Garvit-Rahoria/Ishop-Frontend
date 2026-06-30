import ProductCard from "./ProductCard";

const ProductsGrid = () => {
    const products = Array.from({ length: 12 });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((_, i) => (
                <ProductCard key={i} />
            ))}
        </div>
        
    );
};

export default ProductsGrid;
