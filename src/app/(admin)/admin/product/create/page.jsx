"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories, getBrands, getColors } from "@/api/api-call";
import Select from 'react-select'
import { notify, client } from "@/utils/helper";
import { Editor } from 'primereact/editor';
import { FiUploadCloud } from "react-icons/fi";

export default function AddProduct() {

    const router = useRouter()
    const [image, setImage] = useState("")
    const [text, setText] = useState("")
    const [selColor, setSelColor] = useState([])
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(false)

    const nameRef = useRef();
    const slugRef = useRef();
    const fileRef = useRef();
    const orginal_price = useRef();
    const discount_percent = useRef();
    const final_price = useRef();

    function colorSelect(cat) {
        const selectItem = cat.map((cat) => cat.value)
        setSelColor(selectItem)
    }

    const getData = async () => {
        const [catRes, brandRes, colorRes] = await Promise.all([
            getCategories(),
            getBrands(),
            getColors()
        ])
        setCategories(catRes?.data?.map((cat) => (
            {
                name: cat.name,
                value: cat._id
            }
        ))
            || [])
        setBrands(brandRes?.data?.map((brand) => (
            {
                name: brand.name,
                value: brand._id
            }
        ))
            || [])
        setColors(colorRes?.data?.map((color) => (
            {
                name: color.name,
                value: color._id
            }
        ))
            || [])
        // console.log(catRes, brandRes, colorRes)
    }

    useEffect(
        () => {
            getData()
        },
        []
    )


    function createSlug() {
        let catSlug = nameRef.current.value;

        let slug = catSlug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

        slugRef.current.value = slug;
    }

    // function calculatePrice() {
    //     let op = parseInt(orginal_price.current.value);
    //     let fp = parseInt(final_price.current.value);

    //     if (op <= 0 || fp < 0 || fp > op) {
    //         discount_percent.current.value = 0
    //     }
    //     let dp = Math.floor(((op - fp) / op) * 100)
    //     discount_percent.current.value = dp
    // }

    function calculatePrice(type) {
        let op = parseInt(orginal_price.current.value) || 0;
        let dp = parseInt(discount_percent.current.value) || 0;
        let fp = parseInt(final_price.current.value) || 0;

        if (op <= 0) return;

        //  Case 1: Discount change hua → Final nikalo
        if (type === "discount") {
            if (dp < 0 || dp > 100) {
                discount_percent.current.value = 0;
                final_price.current.value = op;
                return;
            }

            let final = Math.floor(op - (op * dp / 100));
            final_price.current.value = final;
        }

        //  Case 2: Final change hua → Discount nikalo
        if (type === "final") {
            if (fp < 0 || fp > op) {
                final_price.current.value = op;
                discount_percent.current.value = 0;
                return;
            }

            let discount = Math.floor(((op - fp) / op) * 100);
            discount_percent.current.value = discount;
        }

        //  Case 3: Original change hua → dono recalc
        if (type === "original") {
            if (dp > 0) {
                let final = Math.floor(op - (op * dp / 100));
                final_price.current.value = final;
            } else if (fp > 0) {
                let discount = Math.floor(((op - fp) / op) * 100);
                discount_percent.current.value = discount;
            }
        }
    }


    const submitHandler = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("thumbnail", event.target.thumbnail.files[0])
        formData.append("name", nameRef.current.value);
        formData.append("slug", slugRef.current.value);
        formData.append("orginal_price", orginal_price.current.value);
        formData.append("discount_percent", discount_percent.current.value);
        formData.append("final_price", final_price.current.value);
        formData.append("colorId", JSON.stringify(selColor));
        formData.append("categoryId", event.target.category.value);
        formData.append("brandId", event.target.brand.value);
        formData.append("short_description", event.target.short_description.value);
        formData.append("long_description", text);

        setLoading(true)

        client.post("/product/create", formData).then(
            (response) => {
                notify(response.data.message, response.data.success)

                if (response.data.success) {
                    nameRef.current.value = ""
                    slugRef.current.value = ""
                    fileRef.current.value = ""
                    orginal_price.current.value = ""
                    final_price.current.value = ""
                    discount_percent.current.value = ""
                    event.target.reset()
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

    return (
        <form onSubmit={submitHandler} className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">

                {/* Title */}
                <h2 className="text-2xl font-semibold">Add Product</h2>

                {/* Name & Slug */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                            type="text"
                            ref={nameRef}
                            onChange={createSlug}
                            placeholder="Enter product name"
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Slug</label>
                        <input
                            type="text"
                            ref={slugRef}
                            placeholder="Auto generated slug"
                            readOnly
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
                        />
                    </div>
                </div>

                {/* Short Description */}
                <div>
                    <label className="text-sm font-medium">Short Description</label>
                    <textarea
                        name="short_description"
                        placeholder="Enter short description"
                        className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Long Description */}
                <div>
                    <label className="text-sm font-medium">Long Description</label>
                    <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }}
                        className="mt-2"

                    />

                </div>

                {/* Price Section */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Original Price</label>
                        <input
                            type="number"
                            ref={orginal_price}
                            // onChange={calculatePrice}
                            onChange={() => calculatePrice("original")}
                            placeholder="Enter price"
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Discount %</label>
                        <input
                            type="number"
                            ref={discount_percent}
                            // onChange={calculatePrice}
                            onChange={() => calculatePrice("discount")}
                            placeholder="Enter discount"
                            className="w-full mt-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Final Price</label>
                        <input
                            type="number"
                            ref={final_price}
                            // onChange={calculatePrice}
                            onChange={() => calculatePrice("final")}
                            placeholder="Auto calculated"
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-100"
                        />
                    </div>
                </div>

                {/* Category / Brand / Colors */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select className="w-full  mt-1 rounded-xl border border-gray-100"
                            name="category"
                            instanceId="select-category"
                            options={categories.map((cat) => (
                                { value: cat.value, label: cat.name }
                            ))} />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Brand</label>
                        <Select className="w-full  mt-1 rounded-xl border border-gray-100"
                            name="brand"
                            instanceId="select-brand"
                            options={brands.map((cat) => (
                                { value: cat.value, label: cat.name }
                            ))} />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Colors</label>
                        <Select className="w-full mt-1 rounded-xl border border-gray-100"
                            isMulti
                            name="color"
                            instanceId="select-color"
                            onChange={colorSelect}
                            closeMenuOnSelect={false}
                            options={colors.map((color) => (
                                { value: color.value, label: color.name }
                            ))} />
                    </div>
                </div>

                {/* Thumbnail */}
                {/* <div>
                    <label className="text-sm font-medium">Thumbnail Image</label>
                    <input
                        type="file"
                        name="thumbnail"
                        ref={fileRef}
                        className="w-full mt-1 px-4 py-2 border rounded-lg bg-white"
                    />
                </div> */}

                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Thumbnail 
                    </label>

                    <div className='flex items-center justify-center'>
                        {image && (
                            <img
                                src={image}
                                alt="category"
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
                        name="thumbnail"
                        ref={fileRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setImage(URL.createObjectURL(file));
                        }}
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-950 hover:bg-blue-900 cursor-pointer text-white px-6 py-2 rounded-lg">
                        Add Product
                    </button>
                </div>
            </div>
        </form>
    );
}