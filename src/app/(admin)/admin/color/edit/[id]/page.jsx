"use client"

import { use, useEffect, useRef, useState } from 'react'
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { getColorsById } from '@/api/api-call';

export default function EditCategory({ params }) {
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [color, setColor] = useState({})

    const nameRef = useRef();
    const slugRef = useRef();
    // const fileRef = useRef();

    function createSlug() {
        let catSlug = nameRef.current.value;

        let slug = catSlug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

        slugRef.current.value = slug;
    }

    const submitHandler = (event) => {
    event.preventDefault();

    const data = {
        name: nameRef.current.value,
        slug: slugRef.current.value,
        color_code: event.target.color_code.value
    };

    setLoading(true);

    client.put(`/color/update/${id}`, data)
        .then((response) => {
            notify(response.data.message, response.data.success);

            if (response.data.success) {
                router.push("/admin/color");
            }
        })
        .catch((error) => {
            console.log(error?.response);
            notify("Update failed", false);
        })
        .finally(() => setLoading(false));
};

    async function getColor() {
        setFetchLoading(true)
        try {

            const { data, meta } = await getColorsById(id)
            setColor(data)

        } catch (error) {
            console.log(error)
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(
        () => {
            getColor()
        },
        [id]
    )
    if (fetchLoading) {
        return (
            <h2 className='h-screen flex justify-center items-center'>Loading...</h2>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200">

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Color
                    </h2>
                </div>

                <form className="space-y-5" onSubmit={submitHandler}>

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            ref={nameRef}
                            defaultValue={color?.name}
                            onChange={createSlug}
                            placeholder="e.g. Men Clothing"
                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Slug
                        </label>
                        <input
                            type="text"
                            ref={slugRef}
                            defaultValue={color?.slug}
                            readOnly
                            placeholder="e.g. men-clothing"
                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
                        />
                    </div>

                    {/* color_code */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            HexCode
                        </label>

                        <div
                            className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-blue-950 transition"
                        >
                            <input
                                type="color"
                                name="color_code"
                                className="w-full cursor-pointer"
                                defaultValue={color?.color_code}
                            />
                        </div>
                    </div>



                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-blue-950 text-white font-medium hover:shadow-lg"
                    >
                        {loading ? "waiting..." : "Edit"}
                    </button>

                </form>

            </div>
        </div>
    )
}