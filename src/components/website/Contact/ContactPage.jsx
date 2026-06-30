import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import MapSection from "./MapSection";

const ContactPage = () => {
    return (
        <>
            <section className="bg-white pt-10">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-lg font-semibold mb-2">
                        READY TO WORK WITH US
                    </h1>
                    <p className="text-sm text-gray-600 mb-8">
                        Contact us for all your questions and opinions
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7">
                            <ContactForm />
                        </div>
                        <div className="lg:col-span-5">
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>

            {/* MAP SECTION */}
            <MapSection />
        </>
    );
};

export default ContactPage;
