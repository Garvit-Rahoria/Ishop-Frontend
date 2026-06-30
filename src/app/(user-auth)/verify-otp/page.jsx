"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { client,notify } from "@/utils/helper";

const OtpPage = () => {

    const searchParams = useSearchParams();
    const email = searchParams.get("email")
    const router = useRouter()
    const [loading,setLoading] = useState(false)
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalOtp = otp.join("");


        setLoading(true);

        client.post("/user/verify-otp", {otp: finalOtp ,email})
            .then((response) => {
                notify(response.data.message, response.data.success);

                if (response.data.success) {
                    
                    router.push("/login");
                }
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
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center ">

                {/* Heading */}
                <h1 className="text-2xl font-bold text-teal-600 mb-2">
                    Verify OTP
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Enter the 6 digit code sent to your email 📩
                </p>

                <form onSubmit={handleSubmit}>

                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) =>
                                    handleChange(e.target.value, index)
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(e, index)
                                }
                                ref={(el) => (inputs.current[index] = el)}
                                className="w-10 h-10 text-center text-lg font-semibold 
                                border border-gray-400 rounded-lg 
                                focus:ring-2 focus:ring-teal-500 outline-none transition"
                            />
                        ))}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold transition shadow-md"
                    >
                       {loading ? "Please Wait...": " Verify OTP"}
                    </button>
                </form>

                {/* Resend */}
                <p className="text-sm text-gray-500 mt-4">
                    Didn’t receive code?{" "}
                    <button className="text-teal-600 font-medium hover:underline">
                        Resend
                    </button>
                </p>

            </div>
        </section>
    );
};

export default OtpPage;