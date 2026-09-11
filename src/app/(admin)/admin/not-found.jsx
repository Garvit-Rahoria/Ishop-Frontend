import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-6">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-teal-400 mb-3">404</h1>
                <p className="text-slate-300 mb-6">This admin page was not found.</p>
                <Link
                    href="/admin"
                    className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
