import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import MapSection from "./MapSection";
import { FiMail, FiMessageCircle, FiClock } from "react-icons/fi";

const ContactPage = () => {
    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden bg-slate-900 text-white">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(20,184,166,0.45), transparent), radial-gradient(ellipse 60% 50% at 90% 80%, rgba(15,118,110,0.35), transparent)",
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
                    <p className="text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                        Swoo Tech Mart Support
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-xl">
                        We&apos;re here to help
                    </h1>
                    <p className="mt-3 text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
                        Questions about orders, products, or delivery? Send a message —
                        our team usually replies within one business day.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 md:gap-8">
                        <div className="flex items-center gap-2.5 text-sm text-slate-200">
                            <span className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                                <FiMail size={16} />
                            </span>
                            Fast email reply
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-200">
                            <span className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                                <FiClock size={16} />
                            </span>
                            Mon–Sat, 10am–7pm IST
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-200">
                            <span className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center">
                                <FiMessageCircle size={16} />
                            </span>
                            Order & product help
                        </div>
                    </div>
                </div>
            </section>

            {/* Form + info */}
            <section className="bg-[#f3f4f6] dark:bg-[#0b1120] py-10 md:py-14 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                    Send us a message
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 mb-6">
                                    Fill the form below — we&apos;ll get back to your email.
                                </p>
                                <ContactForm />
                            </div>
                        </div>
                        <div className="lg:col-span-5">
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>

            <MapSection />
        </>
    );
};

export default ContactPage;
