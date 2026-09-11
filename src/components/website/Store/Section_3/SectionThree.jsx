import Filters from "./Filters/Filters";
import BestSellerRow from "./Products/BestSellerRow";

const SectionThree = ({ params }) => {
    return (
        <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-12 gap-8">
                <aside className="col-span-12 lg:col-span-3">
                    <Filters />
                </aside>

                <main className="col-span-12 lg:col-span-9 space-y-8">
                    <BestSellerRow params={params} />
                </main>
            </div>
        </section>
    );
};

export default SectionThree;
