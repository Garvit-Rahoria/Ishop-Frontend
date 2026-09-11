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
            confirmButtonColor: "#0d9488",
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

    return (
        <button onClick={deleteHandler} className="bg-red-100 text-red-500 p-2 rounded-lg cursor-pointer hover:bg-red-200">
            <FaTrash />
        </button>
    );
}

export default DeleteBtn;