import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiHeadphones } from "react-icons/fi";

const offices = [
    {
        tag: "India · Head office",
        address: "WsCube Tech, Jaipur, Rajasthan, India",
        phone: "+91 80000 00000",
        email: "hello@swootechmart.com",
    },
    {
        tag: "Support desk",
        address: "Online help for orders & products",
        phone: "+91 90000 00000",
        email: "support@swootechmart.com",
    },
];

const socials = [
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
];

const ContactInfo = () => {
    return (
        <div className="space-y-5">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="flex items-start gap-3">
                    <span className="shrink-0 w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <FiHeadphones size={18} />
                    </span>
                    <div>
                        <h3 className="font-bold text-gray-900">Talk to our team</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Prefer email or call? Reach us here anytime during business hours.
                        </p>
                    </div>
                </div>

                {offices.map((office) => (
                    <div
                        key={office.tag}
                        className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2.5"
                    >
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-teal-700">
                            {office.tag}
                        </p>
                        <p className="flex items-start gap-2 text-sm text-gray-700">
                            <FiMapPin className="mt-0.5 shrink-0 text-teal-600" size={14} />
                            {office.address}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-gray-700">
                            <FiPhone className="shrink-0 text-teal-600" size={14} />
                            {office.phone}
                        </p>
                        <a
                            href={`mailto:${office.email}`}
                            className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                        >
                            <FiMail className="shrink-0" size={14} />
                            {office.email}
                        </a>
                    </div>
                ))}

                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Follow us
                    </p>
                    <div className="flex gap-2">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-teal-600 transition"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visual panel (no broken local image) */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 min-h-[180px] flex flex-col justify-end">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(20,184,166,0.55) 0%, transparent 55%), linear-gradient(to top, rgba(15,23,42,0.95), rgba(15,23,42,0.4))",
                    }}
                />
                <div className="relative z-10">
                    <p className="text-teal-200 text-xs font-semibold tracking-wider uppercase">
                        Need faster help?
                    </p>
                    <p className="text-lg font-bold mt-1">Include your order ID</p>
                    <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                        Mention product name or order number in the message so we can resolve it quicker.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
