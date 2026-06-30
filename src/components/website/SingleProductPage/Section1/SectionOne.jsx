import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import PurchaseBox from "./PurchaseBox";

const SectionOne = () => {
    return (
        <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT */}
                    <div className="lg:col-span-5">
                        <ImageGallery />
                    </div>

                    {/* CENTER */}
                    <div className="lg:col-span-4">
                        <ProductInfo />
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-3">
                        <PurchaseBox />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default SectionOne;
