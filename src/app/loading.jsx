// app/loading.jsx
import "./globals.css"

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
            <div className="flex flex-col items-center gap-5">

                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>

                {/* Text */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-teal-700">
                        Loading...
                    </h2>

                    <p className="text-teal-500 mt-1">
                        Please wait...
                    </p>
                </div>

            </div>
        </div>
    );
}