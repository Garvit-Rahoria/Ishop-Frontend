import { FiMapPin } from "react-icons/fi";

const MapSection = () => {
    return (
        <section className="bg-white dark:bg-[#0b1120] py-10 md:py-14 border-t border-gray-100 dark:border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                    <div>
                        <p className="text-xs font-semibold tracking-wider uppercase text-teal-600 dark:text-teal-400 mb-1">
                            Location
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-slate-100">
                            Find us on the map
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                        <FiMapPin className="text-teal-600 dark:text-teal-400" />
                        Jaipur, Rajasthan
                    </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                    <iframe
                        title="Swoo Tech Mart location"
                        src="https://www.google.com/maps?q=WsCube%20Tech%20Jaipur&output=embed"
                        width="100%"
                        height="420"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full grayscale-[20%] hover:grayscale-0 transition duration-500"
                    />
                </div>
            </div>
        </section>
    );
};

export default MapSection;
