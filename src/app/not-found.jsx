// app/not-found.jsx
import "./globals.css"
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50 px-6">
            <div className="text-center max-w-lg">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-teal-600 text-white p-5 rounded-full shadow-lg">
                        <ShoppingBag size={40} />
                    </div>
                </div>

                {/* 404 Text */}
                <h1 className="text-7xl font-bold text-teal-600 mb-4">
                    404
                </h1>

                <h2 className="text-3xl font-semibold text-teal-900 mb-3">
                    Page Not Found
                </h2>

                <p className="text-teal-700 mb-8">
                    Oops! The page you are looking for doesn’t exist or may have been removed.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                    <Link
                        href="/"
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition"
                    >
                        Go To Home
                    </Link>

                    <button
                        
                        className="border border-teal-600 text-teal-700 px-6 py-3 rounded-lg hover:bg-teal-600 hover:text-white transition flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                </div>
            </div>
        </div>
    );
}