import MainBanner from "./MainBanner";
import PathSection from "./PathSection";

const SectionOne = () => {
    return (
        <section className="bg-[#f2f3f7] py-6">
            <div className="max-w-7xl mx-auto px-4">

                <PathSection />

                {/* Main Banner Wrapper */}
                <MainBanner />

            </div>
        </section>
    );
};

export default SectionOne;
