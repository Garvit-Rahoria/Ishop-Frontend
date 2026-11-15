"use client";

import { useState } from "react";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            notify("Passwords do not match", false);
            return;
        }

        if (form.password.length < 6) {
            notify("Password should be at least 6 characters", false);
            return;
        }

        setLoading(true);

        client.post("/user/register", form)
            .then((response) => {
                notify(response.data.message, response.data.success);

                if (response.data.success) {
                    const devOtp = response.data?.data?.devOtp;
                    const registeredEmail = form.email;
                    setForm({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: ""
                    });
                    const devParam = devOtp ? `&devOtp=${encodeURIComponent(devOtp)}` : "";
                    router.push(`/verify-otp?email=${encodeURIComponent(registeredEmail)}${devParam}`);
                }
            })
            .catch((error) => {
                const message =
                    error?.response?.data?.message || "Registration failed. Try again.";
                notify(message, false);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-7 sm:p-10 w-full relative overflow-hidden transition-colors">
            {/* Top Logo & Title */}
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition">
                        S
                    </div>
                    <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-slate-100">
                        SWOO <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">TECH MART</span>
                    </span>
                </Link>

                <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 dark:text-slate-100 tracking-tight">
                    Create an Account
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Join Swoo Tech Mart for warranty support &amp; fast checkout
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                        Full Name
                    </label>
                    <div className="relative flex items-center">
                        <FiUser className="absolute left-3.5 text-gray-400 dark:text-slate-500" size={17} />
                        <input
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                        Email Address
                    </label>
                    <div className="relative flex items-center">
                        <FiMail className="absolute left-3.5 text-gray-400 dark:text-slate-500" size={17} />
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                        Password
                    </label>
                    <div className="relative flex items-center">
                        <FiLock className="absolute left-3.5 text-gray-400 dark:text-slate-500" size={17} />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={form.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                        Confirm Password
                    </label>
                    <div className="relative flex items-center">
                        <FiLock className="absolute left-3.5 text-gray-400 dark:text-slate-500" size={17} />
                        <input
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            required
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 p-1 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition cursor-pointer"
                            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Create Account</span>
                            <FiArrowRight size={16} />
                        </>
                    )}
                </button>

                {/* Switch to Login */}
                <div className="pt-2 text-center border-t border-gray-100 dark:border-slate-800">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Security Footer */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                    <FiShield size={13} className="text-teal-500" />
                    <span>Your data is protected with 256-Bit SSL Encryption</span>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
