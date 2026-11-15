/**
 * Admin Panel Data Formatting Utilities
 * Provides standardized, professional formatting for currency, dates, statuses, and badges.
 */

/**
 * Format any number or numeric string as Indian Rupee (₹).
 * @param {number|string} amount
 * @param {boolean} showDecimals
 * @returns {string} e.g. "₹1,299" or "₹12,499.50"
 */
export function formatCurrency(amount, showDecimals = false) {
    const num = Number(amount);
    if (isNaN(num)) return "₹0";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: showDecimals ? 2 : 0,
        minimumFractionDigits: showDecimals ? 2 : 0,
    }).format(num);
}

/**
 * Format date into clean, human-readable Indian standard format.
 * @param {string|Date} value
 * @param {boolean} includeTime
 * @returns {string} e.g. "13 Nov 2026, 10:45 AM"
 */
export function formatDate(value, includeTime = true) {
    if (!value) return "—";
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return "—";

        const options = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };

        if (includeTime) {
            options.hour = "2-digit";
            options.minute = "2-digit";
            options.hour12 = true;
        }

        return date.toLocaleString("en-IN", options);
    } catch {
        return "—";
    }
}

/**
 * Format relative time (e.g., "5m ago", "2h ago", "Yesterday").
 * @param {string|Date} value
 * @returns {string}
 */
export function formatTimeAgo(value) {
    if (!value) return "—";
    try {
        const date = new Date(value);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffSeconds < 60) return "Just now";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
        if (diffSeconds < 172800) return "Yesterday";
        if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

        return formatDate(value, false);
    } catch {
        return "—";
    }
}

/**
 * Get badge styling metadata for order status.
 * @param {string} status
 */
export function getOrderStatusMeta(status) {
    const normalized = String(status || "placed").toLowerCase().trim();

    const map = {
        placed: {
            label: "Placed",
            bg: "bg-amber-50",
            text: "text-amber-700",
            border: "border-amber-200/80",
            dot: "bg-amber-500",
        },
        confirmed: {
            label: "Confirmed",
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200/80",
            dot: "bg-blue-500",
        },
        shipped: {
            label: "Shipped",
            bg: "bg-indigo-50",
            text: "text-indigo-700",
            border: "border-indigo-200/80",
            dot: "bg-indigo-500",
        },
        out_for_delivery: {
            label: "Out for Delivery",
            bg: "bg-purple-50",
            text: "text-purple-700",
            border: "border-purple-200/80",
            dot: "bg-purple-500",
        },
        delivered: {
            label: "Delivered",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200/80",
            dot: "bg-emerald-500",
        },
        cancelled: {
            label: "Cancelled",
            bg: "bg-rose-50",
            text: "text-rose-700",
            border: "border-rose-200/80",
            dot: "bg-rose-500",
        },
        returned: {
            label: "Returned",
            bg: "bg-slate-100",
            text: "text-slate-700",
            border: "border-slate-300",
            dot: "bg-slate-500",
        },
    };

    return (
        map[normalized] || {
            label: normalized.replaceAll("_", " "),
            bg: "bg-slate-50",
            text: "text-slate-700",
            border: "border-slate-200",
            dot: "bg-slate-400",
        }
    );
}

/**
 * Get badge styling metadata for payment method and status.
 * @param {string} method
 * @param {string} status
 */
export function getPaymentMeta(method, status) {
    const isCod = String(method || "").toLowerCase() === "cod";
    const isPaid = String(status || "").toLowerCase() === "paid";
    const isFailed = String(status || "").toLowerCase() === "failed";

    if (isCod) {
        return {
            badge: "COD",
            statusLabel: isPaid ? "Paid on Delivery" : "Cash on Delivery",
            bg: isPaid ? "bg-emerald-50" : "bg-amber-50",
            text: isPaid ? "text-emerald-700" : "text-amber-800",
            border: isPaid ? "border-emerald-200" : "border-amber-200",
        };
    }

    if (isPaid) {
        return {
            badge: "Online",
            statusLabel: "Paid via Razorpay",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-200",
        };
    }

    if (isFailed) {
        return {
            badge: "Online",
            statusLabel: "Payment Failed",
            bg: "bg-rose-50",
            text: "text-rose-700",
            border: "border-rose-200",
        };
    }

    return {
        badge: "Online",
        statusLabel: "Payment Pending",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    };
}

