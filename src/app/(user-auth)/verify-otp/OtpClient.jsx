"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { FiArrowLeft, FiShield } from "react-icons/fi";
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

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").trim();
        if (/^\d+$/.test(text)) {
            const digits = text.split("").slice(0, 6);
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                newOtp[i] = d;
            });
            setOtp(newOtp);
            const focusIdx = Math.min(digits.length, 5);
            inputs.current[focusIdx]?.focus();
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
            notify("Email missing — please register again", false);
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
                error?.response?.data?.message || "OTP verification failed. Please check the code.";
            notify(message, false);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            notify("Email missing — please register again", false);
            return;
        }
        setResending(true);
        try {
            const response = await client.post("/user/reset-otp", { email });
            notify(response.data.message || "New OTP sent to your email", response.data.success);
            setOtp(new Array(6).fill(""));
            inputs.current[0]?.focus();
        } catch (error) {
            notify(error?.response?.data?.message || "Failed to resend OTP", false);
        } finally {
            setResending(false);
        }
    };

    return (
        <section className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-10 sm:py-16 px-4 relative overflow-hidden transition-colors">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full mx-auto relative z-10">
                <div className="mb-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    >
                        <FiArrowLeft size={14} />
                        <span>Back to Sign In</span>
                    </Link>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200/80 dark:border-slate-800 p-7 sm:p-10 w-full text-center transition-colors">
                    {/* Brand */}
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                            S
                        </div>
                        <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-slate-100">
                            SWOO <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm">TECH MART</span>
                        </span>
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1 mb-8">
                        Enter the 6-digit verification code sent to{" "}
                        <span className="font-bold text-gray-900 dark:text-slate-200 break-all">{email || "your email"}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
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
                                    className="w-11 h-14 sm:w-13 sm:h-14 text-center text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all shadow-xs caret-teal-600"
                                    aria-label={`OTP digit ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying OTP...</span>
                                </>
                            ) : (
                                "Verify & Continue"
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
                        Didn&apos;t receive code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-teal-600 dark:text-teal-400 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-slate-500 mt-4">
                        <FiShield size={13} className="text-teal-500" />
                        <span>Encrypted Account Security</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
