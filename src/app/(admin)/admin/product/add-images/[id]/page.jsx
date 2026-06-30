"use client"

import { use, useEffect, useRef, useState } from 'react'
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { FiUploadCloud } from "react-icons/fi";
import { getProductById } from '@/api/api-call';
import { RxCross2 } from "react-icons/rx";



export default function EditCategory({ params }) {

    const [images, setImages] = useState([])
    const { id } = use(params)
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [product, setProduct] = useState({})
    const [baseUrl, setBaseUrl] = useState("")

    const fileRef = useRef();

    // SUBMIT 
    const submitHandler = (event) => {
        event.preventDefault();

        const formData = new FormData();

        for (let img of fileRef.current.files) {
            if (img) {
                formData.append("images", img);
            }
        }

        setLoading(true)

        client.post(`/product/add-images/${id}`, formData).then(
            (response) => {
                notify(response.data.message, response.data.success)

                if (response.data.success) {
                    fileRef.current.value = ""
                    router.push("/admin/product")
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

    // DELETE 
    const removeImage = (img, index) => {

        // DB image
        if (typeof img === "string") {
            client.put(`/product/remove_image/${id}`, { image_name: img }).then(
                (response) => {
                    router.refresh()
                    notify(response.data.message, response.data.success)

                    if (response.data.success) {
                        setImages(prev => prev.filter(i => i !== img))
                    }
                }
            ).catch(
                (error) => {
                    const message = error?.response?.data?.message || "Internal Server Error"
                    notify(message, false)
                }
            )
        }
        // preview image
        else {
            setImages(prev => prev.filter((_, i) => i !== index))
        }
    }

    // FETCH PRODUCT 
    async function getProduct() {
        setFetchLoading(true)
        try {

            const { data, meta } = await getProductById(id)

            setProduct(data)
            setImages(data.images || [])
            setBaseUrl(meta.imageBaseUrl)

        } catch (error) {
            console.log(error)
        } finally {
            setFetchLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [id])

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
                        Add Images
                    </h2>
                </div>

                <form onSubmit={submitHandler} className="space-y-5">

                    <div>
                        <label className="text-sm font-bold text-gray-700">
                            Image
                        </label>

                        <div className='flex gap-2 flex-wrap justify-center mt-3'>
                            {images.map((img, index) => {

                                const isString = typeof img === "string"

                                const imageUrl = isString
                                    ? `${baseUrl}${img}`
                                    : img.preview

                                return (
                                    <div key={index} className='relative'>

                                        <img
                                            src={imageUrl}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                        {/* BUTTON ALWAYS */}
                                        <RxCross2
                                            onClick={() => removeImage(img, index)}
                                            className='absolute top-1 right-1 bg-black text-white text-lg rounded-full p-1 cursor-pointer'
                                        />
                                    </div>
                                )
                            })}
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

                        {/*  PREVIEW FIX */}
                        <input
                            name='image'
                            type="file"
                            className='hidden'
                            multiple
                            ref={fileRef}
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);

                                const previewImages = files.map(file => ({
                                    file,
                                    preview: URL.createObjectURL(file)
                                }));

                                setImages(prev => [...prev, ...previewImages])
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-blue-950 text-white font-medium hover:shadow-lg"
                    >
                        {loading ? "waiting..." : "Add"}
                    </button>

                </form>

            </div>
        </div>
    )
}