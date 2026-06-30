"use client"

import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

function StatusBtn({ value, url, field }) {
    const router = useRouter();



    function statusHandler() {
        client.patch(url, { field })
            .then((response) => {
                notify(response.data.message, response.data.success);
                if (response.data.success) {
                    router.refresh();
                    // router.push("/admin/category");
                }
            })
            .catch((error) => {
                const message =
                    error?.response?.data?.message || "Internal Server Error"
                notify(message, false)
            });
    }

    const lable = {
        status: ["Active", "Inactive"],
        is_home: ["Home", "Not home"],
        is_top: ["Top", "Not top"],
        is_popular: ["Popular", "Not popular"],
    }
    const [TrueLable, FalseLable] = lable[field] || { "Yes": "No" }

    const base = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer";

    return (
        <button
            onClick={statusHandler}
            className={` ${base} ${value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
        >
            {value ? TrueLable : FalseLable}
        </button>
    );
}

export default StatusBtn;