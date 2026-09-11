"use client";

import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
];

export default function OrderStatusSelect({ orderId, value }) {
    const router = useRouter();

    const onChange = (e) => {
        const status = e.target.value;
        client
            .patch(`/order/${orderId}/status`, { status })
            .then((res) => {
                notify(res.data.message, res.data.success);
                if (res.data.success) router.refresh();
            })
            .catch((err) => {
                notify(err?.response?.data?.message || "Failed to update status", false);
            });
    };

    return (
        <select
            value={value || "placed"}
            onChange={onChange}
            className="border rounded-lg px-2 py-1 text-sm bg-white"
        >
            {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                    {s.replaceAll("_", " ")}
                </option>
            ))}
        </select>
    );
}
