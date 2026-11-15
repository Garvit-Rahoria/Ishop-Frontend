"use client";

import { useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function StatusBtn({ value, url, field }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function statusHandler() {
    if (loading) return;
    setLoading(true);

    client
      .patch(url, { field })
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.refresh();
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Internal Server Error";
        notify(message, false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const labelMap = {
    status: ["Active", "Inactive"],
    is_home: ["Home", "Not Home"],
    is_top: ["Top", "Standard"],
    is_popular: ["Popular", "Standard"],
    stock: ["In Stock", "Out of Stock"],
    top_selling: ["Top Selling", "Normal"],
  };

  const [trueLabel, falseLabel] = labelMap[field] || ["Yes", "No"];
  const isActive = Boolean(value);

  return (
    <button
      type="button"
      onClick={statusHandler}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer disabled:opacity-60 shadow-2xs hover:scale-102 active:scale-98 ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/90 hover:bg-emerald-100"
          : "bg-rose-50 text-rose-700 border border-rose-200/90 hover:bg-rose-100"
      }`}
      title={`Click to switch ${field}`}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin text-current" />
      ) : (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-rose-500 ring-2 ring-rose-200"
          }`}
        />
      )}
      <span>{isActive ? trueLabel : falseLabel}</span>
    </button>
  );
}

export default StatusBtn;
