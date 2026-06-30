'use client'
import { addToCart, qtyChange } from '@/redux/features/cartSlice'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function AddToCartButton({ product, imageBaseUrl }) {
    const cart = useSelector((store) => store.cart);
    const cartItem = cart?.items.find((item) => item.id == product._id)
    console.log(cartItem)

    const dispatcher = useDispatch()
    return (
        // <div>

        //     {
        //         cartItem ?
        //             <div className='flex gap-2'>
        //                 <button>-</button>
        //                 <h2>{cartItem.qty || 0}</h2>
        //                 <button>+</button>
        //             </div>
        //             :
        //             <button
        //                 onClick={() => {
        //                     dispatcher(addToCart(
        //                         {
        //                             id: product._id,
        //                             name: product?.name,
        //                             thumbnail: imageBaseUrl,
        //                             orginal_price: product.orginal_price,
        //                             discount_percentage: product.discount_percentage,
        //                             final_price: product.final_price,
        //                             stock: product.stock,
        //                             qty: 1
        //                         }
        //                     ))
        //                 }}
        //                 className="mt-2 w-full bg-teal-500 cursor-pointer text-white text-[14px] py-1.5 rounded-md hover:bg-gray-800 transition">
        //                 Add to Cart
        //             </button>
        //     }



        // </div>

        //         <div className="mt-3">

        //     {
        //         cartItem ? (
        //             <div className="flex items-center justify-between  bg-gray-100 rounded-lg px-3 py-1.5 w-fit">

        //                 {/* Minus Button */}
        //                 <button
        //                     className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow hover:bg-gray-200 transition text-lg font-bold"
        //                 >
        //                     -
        //                 </button>

        //                 {/* Quantity */}
        //                 <h2 className="px-3 text-sm font-semibold">
        //                     {cartItem?.qty || 0}
        //                 </h2>

        //                 {/* Plus Button */}
        //                 <button
        //                     className="w-7 h-7 flex items-center justify-center bg-white rounded-md shadow hover:bg-gray-200 transition text-lg font-bold"
        //                 >
        //                     +
        //                 </button>

        //             </div>
        //         ) : (
        //             <button
        //                 onClick={() => {
        //                     dispatcher(addToCart({
        //                         id: product?._id,
        //                         name: product?.name,
        //                         thumbnail: imageBaseUrl,
        //                         orginal_price: product?.orginal_price,
        //                         discount_percentage: product?.discount_percentage,
        //                         final_price: product?.final_price,
        //                         stock: product?.stock,
        //                         qty: 1
        //                     }))
        //                 }}
        //                 className="mt-2 w-full bg-teal-500 text-white text-sm py-2 rounded-lg hover:bg-teal-600 active:scale-95 transition font-medium"
        //             >
        //                 Add to Cart
        //             </button>
        //         )
        //     }

        // </div>

        <div>
            {
                cartItem ? (
                    <div className='flex items-center justify-center gap-3 mt-2 w-full border-teal-500 rounded-md p-1 '>
                        {/* Minus Button */}
                        <button
                            onClick={() => dispatcher(qtyChange({id:product._id, flag: "dec"}))}
                            className="flex items-center justify-center w-8 h-8 bg-red-500 text-white font-bold rounded hover:bg-teal-500 hover:text-white transition-colors duration-200"
                        >
                            −
                        </button>

                        {/* Quantity Display */}
                        <h2 className="font-semibold text-gray-800 text-sm">
                            {cartItem.qty || 0}
                        </h2>

                        {/* Plus Button */}
                        <button
                            onClick={() => dispatcher(qtyChange({id:product._id, flag: "inc"}))}
                            className="flex items-center justify-center w-8 h-8 bg-green-500 text-white font-bold rounded hover:bg-teal-500 hover:text-white transition-colors duration-200"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            dispatcher(addToCart({
                                id: product._id,
                                name: product?.name,
                                thumbnail: imageBaseUrl,
                                orginal_price: product.orginal_price,
                                discount_percentage: product.discount_percentage,
                                final_price: product.final_price,
                                stock: product.stock,
                                qty: 1
                            }))
                        }}
                        className="mt-2 w-full bg-teal-500 text-white text-[14px] font-medium py-2 rounded-md hover:bg-teal-600 active:scale-95 transition-all shadow-md"
                    >
                        Add to Cart
                    </button>
                )
            }
        </div>
    )
}
