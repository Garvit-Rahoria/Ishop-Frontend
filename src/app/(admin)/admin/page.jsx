import Link from "next/link";
import {
    FaUsers,
    FaShoppingCart,
    FaRupeeSign,
    FaBox,
    FaTags,
    FaPalette,
    FaClock,
} from "react-icons/fa";
import { SiBrandfetch } from "react-icons/si";
import { getDashboard, getMe } from "@/api/api-call";
import { resolveMediaUrl } from "@/utils/media";

export const dynamic = "force-dynamic";

function formatDate(value) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "-";
    }
}

function formatMoney(n) {
    return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function StatusPill({ children, tone = "gray" }) {
                const tones = {
        gray: "bg-gray-100 text-gray-700",
        green: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-800",
        red: "bg-red-100 text-red-700",
        blue: "bg-teal-100 text-teal-700",
    };
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${tones[tone] || tones.gray}`}
        >
            {children}
        </span>
    );
}

function paymentTone(status) {
    if (status === "paid") return "green";
    if (status === "failed") return "red";
    return "amber";
}

export default async function Page() {
    const [dash, me] = await Promise.all([getDashboard(), getMe()]);
    const data = dash?.data || {};
    const counts = data.counts || {};
    const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : [];
    const recentProducts = Array.isArray(data.recentProducts) ? data.recentProducts : [];
    const adminName = me?.user?.name || "Admin";

    const stats = [
        {
            title: "Users",
            value: counts.users ?? 0,
            icon: <FaUsers className="text-sm" />,
            href: "/admin",
        },
        {
            title: "Orders",
            value: counts.orders ?? 0,
            icon: <FaShoppingCart className="text-sm" />,
            href: "/admin/order",
        },
        {
            title: "Revenue",
            value: formatMoney(counts.revenue),
            icon: <FaRupeeSign className="text-sm" />,
            href: "/admin/order",
        },
        {
            title: "Products",
            value: counts.products ?? 0,
            icon: <FaBox className="text-sm" />,
            href: "/admin/product",
        },
        {
            title: "Categories",
            value: counts.categories ?? 0,
            icon: <FaTags className="text-sm" />,
            href: "/admin/category",
        },
        {
            title: "Brands",
            value: counts.brands ?? 0,
            icon: <SiBrandfetch className="text-sm" />,
            href: "/admin/brand",
        },
        {
            title: "Colors",
            value: counts.colors ?? 0,
            icon: <FaPalette className="text-sm" />,
            href: "/admin/color",
        },
        {
            title: "Pending",
            value: counts.pendingOrders ?? 0,
            icon: <FaClock className="text-sm" />,
            href: "/admin/order",
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Welcome back, {adminName}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="bg-amber-50 text-amber-800 border border-amber-100 px-2.5 py-1 rounded-lg">
                        COD {counts.codOrders ?? 0}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        Paid {counts.paidOrders ?? 0}
                    </span>
                    <span className="bg-teal-50 text-teal-800 border border-teal-100 px-2.5 py-1 rounded-lg">
                        Online {counts.onlineOrders ?? 0}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {stats.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-teal-200 hover:shadow-sm transition"
                    >
                        <div className="min-w-0">
                            <p className="text-xs text-gray-500 truncate">{item.title}</p>
                            <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                                {item.value}
                            </p>
                        </div>
                        <div className="text-white p-2.5 rounded-lg shrink-0 bg-teal-600">
                            {item.icon}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start">
                <section className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">
                            Recent Orders
                            <span className="ml-2 text-gray-400 font-normal">
                                ({recentOrders.length})
                            </span>
                        </h2>
                        <Link
                            href="/admin/order"
                            className="text-xs font-medium text-teal-600 hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-gray-400 py-10 text-center">
                            No orders yet
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {recentOrders.map((order) => {
                                const idShort = String(order._id || "").slice(-8);
                                const itemNames = (order.items || [])
                                    .map((i) => i.product_id?.name || "Item")
                                    .slice(0, 2)
                                    .join(", ");
                                const extra =
                                    (order.items || []).length > 2
                                        ? ` +${(order.items || []).length - 2}`
                                        : "";
                                return (
                                    <li
                                        key={order._id}
                                        className="px-4 py-3 hover:bg-gray-50/80 transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {order.user?.name || "Customer"}
                                                    <span className="text-gray-400 font-normal">
                                                        {" "}
                                                        · #{idShort}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    {itemNames}
                                                    {extra}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    <StatusPill tone="blue">
                                                        {order.paymentMethod || "-"}
                                                    </StatusPill>
                                                    <StatusPill
                                                        tone={paymentTone(order.paymentStatus)}
                                                    >
                                                        {order.paymentStatus || "-"}
                                                    </StatusPill>
                                                    <StatusPill>
                                                        {order.orderStatus || "-"}
                                                    </StatusPill>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatMoney(order.totalAmount)}
                                                </p>
                                                <p className="text-[11px] text-gray-400 mt-1 whitespace-nowrap">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>

                <section className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-800">
                            Latest Products
                            <span className="ml-2 text-gray-400 font-normal">
                                ({recentProducts.length})
                            </span>
                        </h2>
                        <Link
                            href="/admin/product"
                            className="text-xs font-medium text-teal-600 hover:underline"
                        >
                            View all
                        </Link>
                    </div>

                    {recentProducts.length === 0 ? (
                        <p className="text-sm text-gray-400 py-10 text-center">
                            No products yet
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {recentProducts.map((product) => (
                                <li key={product._id}>
                                    <Link
                                        href={`/admin/product/edit/${product._id}`}
                                        className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50/80 transition"
                                    >
                                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                                            <img
                                                src={resolveMediaUrl("", product.thumbnail)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-1"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatMoney(product.final_price)}
                                                <span className="mx-1">·</span>
                                                {product.stock ? "In stock" : "Out of stock"}
                                            </p>
                                        </div>
                                        <StatusPill tone={product.status ? "green" : "red"}>
                                            {product.status ? "Active" : "Inactive"}
                                        </StatusPill>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
