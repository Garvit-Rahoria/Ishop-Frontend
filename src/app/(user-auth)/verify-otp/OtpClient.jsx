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
    const [devOtpHint, setDevOtpHint] = useState(searchParams.get("devOtp") || null);
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
            if (response.data?.data?.devOtp) {
                setDevOtpHint(response.data.data.devOtp);
            }
            setOtp(new Array(6).fill(""));
            inputs.current[0]?.focus();
        } catch (error) {
            notify(error?.response?.data?.message || "Failed to resend OTP", false);
        } finally {
            setResending(false);
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 flex flex-col justify-center py-10 sm:py-16 px-4 relative overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-100/25 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-md w-full mx-auto relative z-10">
                <div className="mb-4">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-teal-600 transition"
                    >
                        <FiArrowLeft size={14} />
                        <span>Back to Sign In</span>
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-7 sm:p-10 w-full text-center">
                    {/* Brand */}
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                            S
                        </div>
                        <span className="font-extrabold text-lg tracking-tight text-gray-900">
                            SWOO <span className="text-teal-600 font-semibold text-sm">TECH MART</span>
                        </span>
                    </div>

                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 mb-6">
                        Enter the 6-digit verification code sent to{" "}
                        <span className="font-semibold text-gray-800 break-all">{email || "your email"}</span>
                    </p>

                    {devOtpHint ? (
                        <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-left text-xs text-amber-900 shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                                <div className="space-y-0.5">
                                    <p className="font-extrabold text-[12px] flex items-center gap-1.5 text-amber-900">
                                        <span>⚡</span>
                                        <span>Dev Mode OTP Code:</span>
                                    </p>
                                    <p className="text-[11px] text-amber-700">
                                        Use OTP: <span className="font-mono font-black text-amber-950 text-base tracking-widest bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-300">{devOtpHint}</span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const digits = String(devOtpHint).split("").slice(0, 6);
                                        setOtp(digits);
                                        inputs.current[5]?.focus();
                                    }}
                                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-2xs shrink-0 cursor-pointer"
                                >
                                    Auto Fill
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-3">
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
                                    className="w-11 h-12 text-center text-xl font-bold bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition"
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

                    <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        Didn&apos;t receive code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-teal-600 font-bold hover:underline disabled:opacity-50 cursor-pointer"
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-4">
                        <FiShield size={13} className="text-teal-500" />
                        <span>Encrypted Account Security</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
