"use client"

import { use, useEffect, useRef, useState } from 'react'
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { FiUploadCloud } from "react-icons/fi";
import { getBrandById, getCategories } from '@/api/api-call';
import Select from 'react-select'

export default function EditBrand({ params }) {


    const [image, setImage] = useState("")
    const { id } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [brand, setBrand] = useState({})
    const [category, setCategory] = useState([])
    const [selCategory, setSelCategory] = useState([])

    const nameRef = useRef();
    const slugRef = useRef();
    const fileRef = useRef();

    function categorySelect(cat) {
        setSelCategory(cat ? cat.value : null);
    }

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

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);

        if (selCategory) {
            formData.append("categoryId", selCategory);
        }

        if (fileRef.current.files[0]) {
            formData.append("image", fileRef.current.files[0]);
        }

        setLoading(true)

        client.put(`/brand/update/${id}`, formData).then(
            (response) => {
                notify(response.data.message, response.data.success)

                if (response.data.success) {
                    nameRef.current.value = ""
                    slugRef.current.value = ""
                    fileRef.current.value = ""
                    router.push("/admin/brand")
                }
            }
        ).catch(
            (error) => {
                const message =
                    error?.response?.data?.message || "Internal Server Error"
                notify(message, false)
            }
        ).finally(() => {
            setLoading(false)
        })
    }

    const fetchCategory = async () => {
        try {
            const res = await getCategories()
            setCategory(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
            setCategory([])
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    async function getBrand() {
        setFetchLoading(true)
        try {

            const { data, meta } = await getBrandById(id)

            setBrand(data)
            setImage(`${meta?.imageBaseUrl}/${data.image}`)

            if (data.categoryId) {
                setSelCategory(
                    Array.isArray(data.categoryId) ? data.categoryId[0] : data.categoryId
                )
            }

        } catch (error) {
            console.log(error)
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(
        () => {
            getBrand()
        },
        [id]
    )
    if (fetchLoading) {
        return (
            <h2 className='h-screen flex justify-center items-center'>Loading...</h2>
        )
    }


    // console.log(brand)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">

            <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200">

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Brand
                    </h2>
                </div>

                <form className="space-y-5" onSubmit={submitHandler}>

                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Brand Name
                        </label>
                        <input
                            type="text"
                            ref={nameRef}
                            defaultValue={brand?.name}
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
                            defaultValue={brand?.slug}
                            readOnly
                            placeholder="e.g. men-clothing"
                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Category
                        </label>

                        {/* <Select
                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
                            onChange={categorySelect}
                            options={category.map((cat) => (
                                { value: cat._id, label: cat.name }
                            ))} /> */}

                        <Select
                            name='category'
                            className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
                            onChange={categorySelect}
                            value={
                                category
                                    .map(cat => ({ value: cat._id, label: cat.name }))
                                    .find(opt => opt.value === selCategory) || null
                            }  // ✅ Pre-selected value
                            options={category.map((cat) => ({ value: cat._id, label: cat.name }))}
                        />

                    </div>

                    {/* IMAGE UPLOAD UI */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Brand Image
                        </label>

                        <div className='flex items-center justify-center'>
                            {image && (
                                <img
                                    src={image}
                                    alt="brand"
                                    className="w-20 h-10 object-cover rounded-lg mt-3"
                                />
                            )}
                        </div>

                        <div
                            onClick={() => fileRef.current.click()}
                            className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-950 transition"
                        >
                            <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                                Click to upload or drag & drop
                            </p>
                        </div>

                        <input
                            type="file"
                            ref={fileRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) setImage(URL.createObjectURL(file));
                            }}
                        />
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