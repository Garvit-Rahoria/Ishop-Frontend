import BundleProducts from "./BundleProducts";
import SideBanners from "./SideBanners";

const SectionTwo = () => {
    return (
        <section className="bg-white py-8 mt-4">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT MAIN BUNDLE */}
                    <div className="lg:col-span-9">
                        <BundleProducts />
                    </div>

                    {/* RIGHT SIDE BANNERS */}
                    <div className="lg:col-span-3">
                        <SideBanners />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SectionTwo;
