'use client'

import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

export default function ViewBtn({ prod }) {

    const [toggle, setToggle] = useState(false)

    return (
        <>
            <div
                onClick={() => setToggle(true)}
                className='bg-lime-100 text-lime-500 p-2 cursor-pointer rounded-lg hover:bg-lime-200 w-fit'
            >
                <FaEye />
            </div>

            {
                toggle && (
                    <Overlay
                        prod={prod}
                        onclose={() => setToggle(false)}
                    />
                )
            }
        </>
    )
}



function Overlay({ onclose, prod }) {

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto py-10">

            {/* Modal */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 relative">

                {/* Close Btn */}
                <button
                    onClick={onclose}
                    className="absolute top-4 right-4 bg-red-100 hover:bg-red-200 text-red-500 p-2 rounded-full"
                >
                    <RxCross2 size={20} />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left Side */}
                    <div>

                        {/* Main Image */}
                        <div className="border rounded-2xl overflow-hidden">
                            <img
                                src={prod.thumbnail}
                                alt={prod.name}
                                className="w-full h-[450px] object-cover"
                            />
                        </div>

                        {/* Gallery */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">

                            {
                                prod.image?.map((img, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-xl overflow-hidden"
                                    >
                                        <img
                                           src={`${process.env.NEXT_PUBLIC_PRODUCT_IMAGE}/${img}`}
                                            alt="product"
                                            className="w-full h-24 object-cover"
                                        />
                                    </div>
                                ))
                            }

                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col gap-5">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {prod.name}
                            </h1>

                            <p className="text-gray-500 mt-2">
                                {prod.short_description}
                            </p>
                        </div>

                        {/* Brand */}
                        <div className="flex gap-3 flex-wrap">

                            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                                Brand: {prod.brandId?.name}
                            </span>

                            <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                                Category: {prod.categoryId?.name}
                            </span>

                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4 flex-wrap">

                            <h2 className="text-3xl font-bold text-teal-600">
                                ₹{prod.final_price}
                            </h2>

                            <span className="line-through text-gray-400 text-lg">
                                ₹{prod.orginal_price}
                            </span>

                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                {prod.discount_percentage}% OFF
                            </span>

                        </div>

                        {/* Colors */}
                        <div>

                            <h3 className="font-semibold mb-2">
                                Colors
                            </h3>

                            <div className="flex gap-3">

                                {
                                    prod.colorId?.map((color, index) => (
                                        <div
                                            key={index}
                                            className="w-10 h-10 rounded-full border"
                                            style={{
                                                backgroundColor: color.color_code
                                            }}
                                        ></div>
                                    ))
                                }

                            </div>

                        </div>

                        {/* Stock */}
                        <div>

                            {
                                prod.stock ? (
                                    <span className="text-green-600 font-semibold">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-semibold">
                                        Out of Stock
                                    </span>
                                )
                            }

                        </div>

                        {/* Description */}
                        <div>

                            <h3 className="text-xl font-semibold mb-2">
                                Product Description
                            </h3>

                            <p className="text-gray-600 leading-7">
                                {prod.long_description}
                            </p>

                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 flex-wrap mt-4">

                            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold">
                                Add to Cart
                            </button>

                            <button className="border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white px-6 py-3 rounded-xl font-semibold">
                                Buy Now
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}