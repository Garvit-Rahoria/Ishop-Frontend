"use client";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client, notify } from "@/utils/helper";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const cartItems = JSON.parse(localStorage.getItem("cart")) || null;
    const Items = cartItems?.items || []
    // const [cartItems] = useState(() => {
    //     if (typeof window === "undefined") return [];  // server pe empty return karo
    //     const data = JSON.parse(localStorage.getItem("cart"));
    //     return data?.items || [];
    // });

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        client.post("/user/login", form)
            .then(async (response) => {
                notify(response.data.message, response.data.success);

                if (response.data.success) {
                    console.log(response)
                    router.push("/");
                    // setForm({
                    //     email: "",
                    //     password: "",
                    // });

                    try {
                        const cartRes = await client.post("/cart/sync", {
                            localCart: JSON.stringify(Items)
                        });

                        console.log(cartRes.data, "cartRes")

                        const cartData = cartRes.data?.cart;
                        console.log(cartData)
                        let final_total = 0;
                        let original_total = 0;
                        const items = cartData?.map((item) => {
                            const { name, _id, orginal_price, final_price, discount_percentage, price, thumbnail, stock } = item.productId
                            final_total += (final_price * item.qty)
                            original_total += (orginal_price * item.qty)
                            return {
                                name, _id, orginal_price, final_price, discount_percentage, price, thumbnail: cartRes.data.imageBaseUrl + thumbnail, stock, qty: item.qty
                            }
                        })

                        localStorage.setItem("cart", JSON.stringify({
                            final_total,
                            original_total,
                            items
                        }))

                        

                    } catch (error) {
                        console.log(error)
                    }

                }
                // router.push("/");
            })
            .catch((error) => {
                const message =
                    error?.response?.data?.message || "Internal Server Error";
                notify(message, false);
            })
            .finally(() => {
                setLoading(false);
            });
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

                {/* Email */}
                <div>
                    <label className="label">Email Address</label>
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

                {/* Password */}
                <div className="relative">
                    <label className="label">Password</label>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="•••"
                        className="input pr-10"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 cursor-pointer text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* Forgot password */}
                <div className="text-sm text-gray-400">
                    <Link href="/forgot-password">
                        Forget Password ?
                    </Link>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                >
                    {loading ? "Please wait..." : "LOGIN"}
                </button>

                {/* Register link */}
                <p className="text-sm text-center text-gray-500">
                    NEW USER ?{" "}
                    <Link
                        href="/register"
                        className="text-green-600 font-medium"
                    >
                        SIGN UP
                    </Link>
                </p>

            </form>
        </div>
    );
};

export default LoginForm;