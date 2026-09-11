"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { client, notify } from "@/utils/helper";
import { mirrorAuthCookie } from "@/utils/authCookie";

export default function OtpPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            notify("Please enter the 6-digit OTP", false);
            return;
        }
        if (!email) {
            notify("Email missing — register again", false);
            return;
        }

        setLoading(true);
        try {
            const response = await client.post("/user/verify-otp", {
                otp: finalOtp,
                email,
            });
            notify(response.data.message, response.data.success);

            if (response.data.success) {
                const token = response.data.data?.token;
                if (token) {
                    localStorage.setItem("jwt", token);
                    await mirrorAuthCookie(token);
                }
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            const message =
                error?.response?.data?.message || "OTP verification failed";
            notify(message, false);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            notify("Email missing — register again", false);
            return;
        }
        setResending(true);
        try {
            const response = await client.post("/user/reset-otp", { email });
            notify(response.data.message, response.data.success);
            setOtp(new Array(6).fill(""));
            inputs.current[0]?.focus();
        } catch (error) {
            notify(error?.response?.data?.message || "Failed to resend OTP", false);
        } finally {
            setResending(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-teal-600 mb-2">Verify OTP</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Enter the 6 digit code sent to{" "}
                    <span className="font-medium text-gray-700">{email || "your email"}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputs.current[index] = el)}
                                className="w-10 h-10 text-center text-lg font-semibold border border-gray-400 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition"
                                aria-label={`OTP digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition shadow-md disabled:opacity-50"
                    >
                        {loading ? "Please wait..." : "Verify OTP"}
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4">
                    Didn&apos;t receive code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-teal-600 font-medium hover:underline disabled:opacity-50"
                    >
                        {resending ? "Sending..." : "Resend"}
                    </button>
                </p>
            </div>
        </section>
    );
}
