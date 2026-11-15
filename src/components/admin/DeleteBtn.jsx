"use client";

import { useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

function DeleteBtn({ API, id, itemName = "item" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function deleteHandler() {
    if (loading) return;

    Swal.fire({
      title: "Delete this record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await client.delete(API);
          notify(response.data.message, response.data.success);

          if (response.data.success) {
            router.refresh();
          }
        } catch (error) {
          console.error(error);
          const message =
            error?.response?.data?.message || "Internal Server Error";
          notify(message, false);
        } finally {
          setLoading(false);
        }
      }
    });
  }

  return (
    <button
      type="button"
      onClick={deleteHandler}
      disabled={loading}
      className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition disabled:opacity-50 cursor-pointer hover:shadow-xs"
      title="Delete record"
      aria-label="Delete record"
    >
      {loading ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
    </button>
  );
}

export default DeleteBtn;
