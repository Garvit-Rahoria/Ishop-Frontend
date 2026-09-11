import { Suspense } from "react";
import OtpPage from "./OtpClient";

export default function VerifyOtpPage() {
    return (
        <Suspense
            fallback={
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white px-4">
                    <p className="text-gray-500 text-sm">Loading…</p>
                </section>
            }
        >
            <OtpPage />
        </Suspense>
    );
}
