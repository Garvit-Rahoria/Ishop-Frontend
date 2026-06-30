const MapSection = () => {
    return (
        <section className="bg-white py-8 mt-4">
            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-lg font-semibold mb-6">
                    FIND US ON GOOGLE MAP
                </h2>

                <div className="rounded-xl overflow-hidden border">
                    <iframe
                        src="https://www.google.com/maps?q=WsCube%20Tech%20Jaipur&output=embed"
                        width="100%"
                        height="450"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full"
                    ></iframe>
                </div>

            </div>
        </section>
    );
};

export default MapSection;
