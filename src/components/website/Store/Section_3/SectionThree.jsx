import Filters from "./Filters/Filters";
import BestSellerRow from "./Products/BestSellerRow";
import ProductsToolbar from "./Products/ProductsToolbar";
// import ProductsGrid from "./Products/ProductsGrid";
import Pagination from "./Products/Pagination";
const SectionThree = ({ params }) => {

    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-8">

                {/* LEFT FILTERS */}
                <aside className="col-span-12 lg:col-span-3">
                    <Filters />
                </aside>

                {/* RIGHT CONTENT */}
                <main className="col-span-12 lg:col-span-9 space-y-8">
                    <ProductsToolbar />
                    <BestSellerRow params={params} />
                    {/* <ProductsGrid /> */}
                    <Pagination />
                </main>

            </div>
        </section>
    );
};

export default SectionThree;
