import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50 px-6">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-teal-600 mb-3">404</h1>
                <p className="text-teal-800 mb-6">Page not found.</p>
                <Link
                    href="/login"
                    className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
