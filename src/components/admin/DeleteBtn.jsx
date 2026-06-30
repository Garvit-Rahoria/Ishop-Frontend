"use client"

import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'

function DeleteBtn({ API, value, id }) {
    const router = useRouter();



    function deleteHandler() {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await client.delete(API);

                    notify(response.data.message, response.data.success);

                    if (response.data.success) {
                        Swal.fire("Deleted!", "Your file has been deleted.", "success");
                        router.refresh();
                    }
                } catch (error) {
                    console.error(error);

                    const message =
                        error?.response?.data?.message || "Internal Server Error";

                    notify(message, false);
                }
            }
        });
        console.log("Delete clicked", id);


    }

    const base = "px-3 py-1 rounded-full text-sm font-medium cursor-pointer";

    return (
        // <button
        //     onClick={deleteHandler}
        //     className={` ${base} ${value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        //         }`}
        // >
        //    <FaTrash />    
        // </button>
        <button onClick={deleteHandler} className="bg-red-100 text-red-500 p-2 rounded-lg cursor-pointer hover:bg-red-200">
            <FaTrash />
        </button>
    );
}

export default DeleteBtn;