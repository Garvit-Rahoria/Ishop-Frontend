"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
            const message =
                error?.response?.data?.message ||
                (error?.code === "ERR_NETWORK" || !error?.response
                    ? "Server offline — start API on port 5000"
                    : "Login failed");
            notify(message, false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <h1 className="text-2xl font-semibold text-teal-600 mb-1">
                Welcome Back
            </h1>
            <p className="text-xs text-gray-500 tracking-widest mb-8">
                LOGIN TO CONTINUE
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="label">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        className="input"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative">
                    <label className="label">
                        Password <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="•••"
                        className="input pr-10"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 cursor-pointer text-gray-500"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <p className="text-sm text-gray-400">
                    Forgot password?{" "}
                    <Link href="/contact" className="text-teal-600 hover:underline">
                        Contact support
                    </Link>
                </p>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-teal-700 transition"
                >
                    {loading ? "Please wait..." : "LOGIN"}
                </button>

                <p className="text-sm text-center text-gray-500">
                    NEW USER?{" "}
                    <Link href="/register" className="text-green-600 font-medium">
                        SIGN UP
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
