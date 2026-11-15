"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { client, notify } from "@/utils/helper";
import { mirrorAuthCookie } from "@/utils/authCookie";
import { resolveMediaUrl } from "@/utils/media";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [Items, setItems] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cartItems = JSON.parse(localStorage.getItem("cart")) || null;
            setItems(cartItems?.items || []);
        }
    }, []);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await client.post("/user/login", form);
            notify(response.data.message, response.data.success);

            if (!response.data.success) return;

            const token = response.data.data?.token;
            if (token) {
                localStorage.setItem("jwt", token);
                await mirrorAuthCookie(token);
            }

            try {
                const cartRes = await client.post("/cart/sync", {
                    localCart: JSON.stringify(Items),
                });

                const cartData = cartRes.data?.cart;
                let final_total = 0;
                let original_total = 0;
                const items = (cartData || []).map((item) => {
                    const {
                        name,
                        _id,
                        orginal_price,
                        final_price,
                        discount_percentage,
                        price,
                        thumbnail,
                        stock,
                    } = item.productId || {};
                    final_total += (final_price || 0) * item.qty;
                    original_total += (orginal_price || 0) * item.qty;
                    return {
                        name,
                        _id,
                        orginal_price,
                        final_price,
                        discount_percentage,
                        price,
                        thumbnail: resolveMediaUrl(
                            cartRes.data?.imageBaseUrl,
                            thumbnail
                        ),
                        stock,
                        qty: item.qty,
                    };
                });

                localStorage.setItem(
                    "cart",
                    JSON.stringify({ final_total, original_total, items })
                );
            } catch (_) {
                /* cart sync is best-effort */
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            const errData = error?.response?.data;
            if (errData?.data?.requiresVerification) {
                notify(errData.message || "Please verify your email with OTP first", false);
                const verifyEmailTarget = errData.data.email || form.email;
                router.push(`/verify-otp?email=${encodeURIComponent(verifyEmailTarget)}`);
                return;
            }

            const message =
                errData?.message ||
                (error?.code === "ERR_NETWORK" || !error?.response
                    ? "Server offline — start API on port 5000"
                    : "Login failed");
            notify(message, false);
        } finally {
            setLoading(false);
        }
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
                    Welcome Back
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Sign in to continue to your account &amp; orders
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Field */}
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
                            placeholder="you@example.com"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                            Password
                        </label>
                        <Link
                            href="/contact"
                            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline"
                        >
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative flex items-center">
                        <FiLock className="absolute left-3.5 text-gray-400 dark:text-slate-500" size={17} />
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/60 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-slate-100 text-sm pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition"
                            value={form.password}
                            onChange={handleChange}
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

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <FiArrowRight size={16} />
                        </>
                    )}
                </button>

                {/* Switch to Register */}
                <div className="pt-2 text-center border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-teal-600 font-bold hover:text-teal-700 hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>

                {/* Security Footer */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                    <FiShield size={13} className="text-teal-500" />
                    <span>256-Bit SSL Encrypted &amp; Secure Checkout</span>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
