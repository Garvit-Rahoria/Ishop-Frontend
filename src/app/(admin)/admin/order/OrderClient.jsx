"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  X,
  CreditCard,
  User,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { resolveMediaUrl } from "@/utils/media";
import {
  formatCurrency,
  formatDate,
  formatTimeAgo,
  getOrderStatusMeta,
  getPaymentMeta,
} from "@/utils/adminFormatters";

export default function OrderClient({ initialOrders = [] }) {
  const router = useRouter();
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Keep state in sync with initialOrders
  React.useEffect(() => {
    setOrdersList(initialOrders);
  }, [initialOrders]);

  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      text: `Are you sure you want to permanently delete order #${orderId.slice(-8).toUpperCase()}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: { popup: "rounded-2xl" },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await client.delete(`/order/${orderId}`);
      if (res.data?.success) {
        notify("Order deleted successfully", true);
        setOrdersList((prev) => prev.filter((o) => o._id !== orderId));
        router.refresh();
      } else {
        notify(res.data?.message || "Failed to delete order", false);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to delete order", false);
    }
  };

  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const q = search.toLowerCase().trim();
      const idMatch = String(order._id || "").toLowerCase().includes(q);
      const nameMatch = order.user?.name?.toLowerCase().includes(q);
      const emailMatch = order.user?.email?.toLowerCase().includes(q);
      const phoneMatch = order.shippingAddress?.mobile?.toLowerCase().includes(q);
      const cityMatch = order.shippingAddress?.city?.toLowerCase().includes(q);
      const matchesSearch =
        !q || idMatch || nameMatch || emailMatch || phoneMatch || cityMatch;

      let matchesStatus = true;
      if (statusFilter !== "all") {
        matchesStatus =
          String(order.orderStatus || "").toLowerCase() === statusFilter;
      }

      let matchesPayment = true;
      if (paymentFilter === "cod") {
        matchesPayment =
          String(order.paymentMethod || "").toLowerCase() === "cod";
      } else if (paymentFilter === "online") {
        matchesPayment =
          String(order.paymentMethod || "").toLowerCase() === "online";
      } else if (paymentFilter === "paid") {
        matchesPayment =
          String(order.paymentStatus || "").toLowerCase() === "paid";
      }

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [ordersList, search, statusFilter, paymentFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  }, [filteredOrders]);

  const pendingCount = useMemo(() => {
    return ordersList.filter(
      (o) =>
        ["placed", "confirmed", "shipped"].includes(
          String(o.orderStatus || "").toLowerCase()
        )
    ).length;
  }, [ordersList]);

  const isFiltered = search || statusFilter !== "all" || paymentFilter !== "all";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Fulfillment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {ordersList.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track customer orders, verify payment status, update dispatch stages, and manage delivery addresses.
          </p>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
            <Clock size={14} className="text-teal-600" />
            <span>Pending: <strong>{pendingCount}</strong></span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs">
            <IndianRupee size={14} className="text-teal-400" />
            <span>Total: {formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, email, phone..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Order Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="placed">Placed</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid Only</option>
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Razorpay</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-28">Order Ref</th>
                <th className="py-3.5 px-4 min-w-[180px]">Customer</th>
                <th className="py-3.5 px-4 min-w-[220px]">Purchased Items</th>
                <th className="py-3.5 px-4 min-w-[200px]">Delivery Address</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4 text-center">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-center">Placed On</th>
                <th className="py-3.5 px-4 text-center w-16">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <ShoppingBag size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No orders found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isFiltered
                        ? "No orders match your search and filter criteria."
                        : "Customer orders will appear here once placed on your store."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderIdShort = String(order._id || "").slice(-8).toUpperCase();
                  const customerName = order.user?.name || "Guest Customer";
                  const customerEmail = order.user?.email || "—";
                  const addr = order.shippingAddress || {};
                  const paymentMeta = getPaymentMeta(
                    order.paymentMethod,
                    order.paymentStatus
                  );

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/80 transition-colors align-top"
                    >
                      {/* Order Reference */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-lg border border-slate-200 block w-fit">
                          #{orderIdShort}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {formatTimeAgo(order.createdAt)}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">
                              {customerName}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Mail size={11} className="text-slate-400 shrink-0" />
                              <span className="truncate">{customerEmail}</span>
                            </p>
                            {addr.mobile && (
                              <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <Phone size={11} className="text-slate-400 shrink-0" />
                                <span>{addr.mobile}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Purchased Items */}
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                                <img
                                  src={
                                    resolveMediaUrl(
                                      "",
                                      item.product_id?.thumbnail
                                    ) || "/placeholder.svg"
                                  }
                                  alt={item.product_id?.name || "Product"}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                  {item.product_id?.name || "Product Item"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Qty: <strong className="text-slate-700">{item.qty}</strong> · {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Delivery Address */}
                      <td className="py-4 px-4">
                        <div className="text-xs text-slate-600 space-y-0.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 max-w-[240px]">
                          <p className="font-bold text-slate-900 truncate">
                            {addr.fullName || customerName}
                          </p>
                          <p className="line-clamp-2 text-slate-600">
                            {addr.addressLine || "No Street Address"}
                          </p>
                          <p className="text-slate-500 font-medium">
                            {addr.city ? `${addr.city}, ` : ""}
                            {addr.state || ""}
                            {addr.pincode ? ` - ${addr.pincode}` : ""}
                          </p>
                        </div>
                      </td>

                      {/* Payment Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border w-fit ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
                          >
                            <CreditCard size={11} />
                            <span>{paymentMeta.badge}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {paymentMeta.statusLabel}
                          </span>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          {(order.items || []).length} item(s)
                        </p>
                      </td>

                      {/* Fulfillment Status Select */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <OrderStatusSelect
                          orderId={order._id}
                          value={order.orderStatus}
                        />
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <p className="text-xs font-semibold text-slate-800">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      {/* Delete Action */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete this order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filteredOrders.length}</strong> of{" "}
            {ordersList.length} orders
          </span>
          <span className="font-medium">Order Fulfillment Queue</span>
        </div>
      </div>
    </div>
  );
}

