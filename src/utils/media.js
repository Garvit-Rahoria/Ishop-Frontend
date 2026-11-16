/**
 * Check if running in browser on a production domain (not localhost).
 */
function isClientProduction() {
    if (typeof window === "undefined") {
        return process.env.NODE_ENV === "production" &&
            Boolean(process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_BASE_URL.includes("localhost") && !process.env.NEXT_PUBLIC_API_BASE_URL.includes("127.0.0.1"));
    }
    const host = window.location.hostname;
    return host !== "localhost" && host !== "127.0.0.1";
}

/**
 * On Windows, `localhost` often hits IPv6 (::1). Docker may bind there while
 * the local Node API serves files on 127.0.0.1 — rewrite to avoid broken images.
 */
function preferIpv4Localhost(url) {
    return String(url).replace(
        /^(https?:\/\/)localhost(?=:\d+|\/|$)/i,
        "$1127.0.0.1"
    );
}

/**
 * Build a usable image URL for Cloudinary full URLs or legacy base+filename.
 * Absolute http(s) paths are returned as-is.
 */
export function resolveMediaUrl(baseUrl, path, fallback = "/placeholder.svg") {
    if (!path) return fallback;

    let value = String(path).trim();
    if (!value) return fallback;

    // If on live production site, and image is pointing to localhost / 127.0.0.1,
    // browser will block mixed content or fail connection. Rewrite or fallback.
    const isProd = isClientProduction();
    if (isProd && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(value)) {
        // If baseUrl is provided (e.g. Render backend), rewrite origin to baseUrl
        const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || baseUrl || "").replace(/\/api\/?$/, "").replace(/\/+$/, "");
        if (apiBase && !apiBase.includes("localhost") && !apiBase.includes("127.0.0.1")) {
            value = value.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, apiBase);
        } else {
            return fallback;
        }
    }

    if (/^https?:\/\//i.test(value) || value.startsWith("//") || value.startsWith("data:")) {
        return isProd ? value : preferIpv4Localhost(value);
    }

    if (value.startsWith("/")) return value;

    const base = isProd ? (baseUrl || "").replace(/\/+$/, "") : preferIpv4Localhost((baseUrl || "").replace(/\/+$/, ""));
    if (!base) return `/${value.replace(/^\/+/, "")}`;

    return `${base}/${value.replace(/^\/+/, "")}`;
}

/**
 * Standard onError image handler to prevent broken-image icon on UI.
 */
export function handleImageError(e, fallback = "/placeholder.svg") {
    if (e?.target && e.target.src !== fallback) {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = fallback;
    }
}
