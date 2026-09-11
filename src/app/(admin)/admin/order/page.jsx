import { getOrders } from "@/api/api-call";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
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

function paymentBadge(method, status) {
    if (method === "cod") {
        return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                COD · {status || "pending"}
            </span>
        );
    }
    const paid = status === "paid";
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
        >
            Online · {status || "pending"}
        </span>
    );
}

export default async function OrdersPage() {
    const res = await getOrders();
    const orders = Array.isArray(res?.orders) ? res.orders : [];

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Order Management</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            COD and online orders placed by customers
                        </p>
                    </div>
                    <div className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                        {orders.length} Orders
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                            <tr>
                                <th className="text-left p-4">Order</th>
                                <th className="text-left p-4">Customer</th>
                                <th className="text-left p-4">Items</th>
                                <th className="text-left p-4">Address</th>
                                <th className="text-left p-4">Payment</th>
                                <th className="text-left p-4">Total</th>
                                <th className="text-left p-4">Status</th>
                                <th className="text-left p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center p-8 text-gray-500">
                                        No orders found yet.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const addr = order.shippingAddress || {};
                                    return (
                                        <tr key={order._id} className="border-t hover:bg-gray-50 align-top">
                                            <td className="p-4 text-xs font-mono text-gray-600">
                                                #{String(order._id).slice(-8)}
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium">{order.user?.name || "User"}</p>
                                                <p className="text-xs text-gray-500">{order.user?.email || "-"}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-2">
                                                    {(order.items || []).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            {item.product_id?.thumbnail ? (
                                                                <img
                                                                    src={resolveMediaUrl("", item.product_id.thumbnail)}
                                                                    alt={item.product_id?.name || "product"}
                                                                    className="w-8 h-8 rounded object-cover"
                                                                />
                                                            ) : null}
                                                            <div>
                                                                <p className="text-sm font-medium line-clamp-1">
                                                                    {item.product_id?.name || "Product"}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    qty {item.qty} · ₹{item.total}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 max-w-[220px]">
                                                <p className="font-medium text-gray-800">{addr.fullName}</p>
                                                <p>{addr.addressLine}</p>
                                                <p>
                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                </p>
                                                <p>{addr.mobile}</p>
                                            </td>
                                            <td className="p-4">
                                                {paymentBadge(order.paymentMethod, order.paymentStatus)}
                                            </td>
                                            <td className="p-4 font-semibold">₹{order.totalAmount}</td>
                                            <td className="p-4">
                                                <OrderStatusSelect
                                                    orderId={order._id}
                                                    value={order.orderStatus}
                                                />
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(order.createdAt)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
