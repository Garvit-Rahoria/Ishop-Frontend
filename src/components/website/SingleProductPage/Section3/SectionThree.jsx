import Tabs from "./Tabs";
import DescriptionTab from "./DescriptionTab";

const SectionThree = () => {
    return (
        <section className="bg-white py-10 mt-4">
            <div className="max-w-7xl mx-auto px-4">
                <Tabs />
                <DescriptionTab />
            </div>
        </section>
    );
};

export default SectionThree;
