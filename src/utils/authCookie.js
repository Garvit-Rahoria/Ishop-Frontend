/** Mirror API JWT onto the Next.js origin so SSR + proxy cookie checks work. */
export async function mirrorAuthCookie(token) {
    if (!token) return;
    await fetch("/api/set-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "same-origin",
    });
}

export async function clearAuthCookie() {
    try {
        await fetch("/api/set-auth", {
            method: "DELETE",
            credentials: "same-origin",
        });
    } catch (_) {
        /* ignore */
    }
}
