import { toast } from 'react-toastify';
import axios from 'axios';

const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    ""
).replace(/\/$/, ""); // strip trailing slash

if (!API_BASE_URL) {
    console.warn(
        "[helper.js] WARNING: NEXT_PUBLIC_API_BASE_URL is not set. " +
        "API calls will fail. Set it in your .env or Vercel environment variables."
    );
}

const client = axios.create({
    baseURL: API_BASE_URL || undefined,
    withCredentials: true,
});

// Attach JWT token at request time — browser only, never during SSR
client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("jwt");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    }
    return config;
});

const notify = (msg, flag) => toast(msg, { type: flag ? "success" : "error" });

export { notify, client };
