import RegisterForm from "./RegisterForm";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const RegisterPage = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-10 sm:py-16 px-4 relative overflow-hidden transition-colors duration-200">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-100/25 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full mx-auto relative z-10">
                {/* Back Link */}
                <div className="mb-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    >
                        <FiArrowLeft size={14} />
                        <span>Back to Swoo Store</span>
                    </Link>
                </div>

                <RegisterForm />
            </div>
        </section>
    );
};

export default RegisterPage;
