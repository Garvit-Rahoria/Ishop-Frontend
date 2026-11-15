"use client";

import { useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getOrderStatusMeta } from "@/utils/adminFormatters";

const ALL_STATUSES = [
  { value: "placed", label: "Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

export default function OrderStatusSelect({ orderId, value }) {
  const router = useRouter();
  const [current, setCurrent] = useState(value || "placed");
  const [loading, setLoading] = useState(false);

  // Define allowed transitions for each state (strict sequential workflow)
  const getAllowedStatuses = (status) => {
    switch (status) {
      case "placed":
        return ["placed", "confirmed", "cancelled"];
      case "confirmed":
        return ["confirmed", "shipped", "cancelled"];
      case "shipped":
        return ["shipped", "out_for_delivery"];
      case "out_for_delivery":
        return ["out_for_delivery", "delivered"];
      case "delivered":
        return ["delivered", "returned"];
      case "cancelled":
        return ["cancelled"];
      case "returned":
        return ["returned"];
      default:
        return [status];
    }
  };

  const allowedStatuses = getAllowedStatuses(current);
  const isFinal = current === "cancelled" || current === "returned";
  const meta = getOrderStatusMeta(current);

  const onChange = async (e) => {
    const nextStatus = e.target.value;
    if (!nextStatus || nextStatus === current) return;

    if (!allowedStatuses.includes(nextStatus)) {
      notify("Please follow the order fulfillment sequence.", false);
      return;
    }

    setLoading(true);
    try {
      const res = await client.patch(`/order/${orderId}/status`, {
        status: nextStatus,
      });

      if (res.data?.success) {
        notify(res.data.message || "Order status updated", true);
        setCurrent(nextStatus);
        router.refresh();
      } else {
        notify(res.data?.message || "Failed to update status", false);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update status", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={onChange}
        disabled={loading || isFinal}
        aria-label="Fulfillment Status"
        className={`appearance-none text-xs font-semibold rounded-full px-4 py-1.5 pr-8 border transition shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
          isFinal ? "cursor-default opacity-90" : "cursor-pointer"
        } ${meta.bg} ${meta.text} ${meta.border}`}
      >
        {ALL_STATUSES.map((opt) => {
          const isAllowed = allowedStatuses.includes(opt.value);
          return (
            <option
              key={opt.value}
              value={opt.value}
              disabled={!isAllowed}
              className={
                isAllowed
                  ? "bg-white text-slate-800 font-medium py-1"
                  : "bg-slate-50 text-slate-400 font-normal py-1"
              }
            >
              {opt.label}
            </option>
          );
        })}
      </select>

      {/* Clean Status Dot / Loading Spinner */}
      <div className="absolute right-3 pointer-events-none flex items-center">
        {loading ? (
          <Loader2 size={12} className="animate-spin text-current" />
        ) : (
          <span
            className={`w-2 h-2 rounded-full ${meta.dot} ${
              !isFinal && current !== "delivered" ? "animate-pulse" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
}
