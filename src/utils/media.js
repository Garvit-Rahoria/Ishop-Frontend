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

    const value = String(path).trim();
    if (!value) return fallback;

    if (/^https?:\/\//i.test(value) || value.startsWith("//") || value.startsWith("data:")) {
        return preferIpv4Localhost(value);
    }

    if (value.startsWith("/")) return value;

    const base = preferIpv4Localhost((baseUrl || "").replace(/\/+$/, ""));
    if (!base) return `/${value.replace(/^\/+/, "")}`;

    return preferIpv4Localhost(`${base}/${value.replace(/^\/+/, "")}`);
}
