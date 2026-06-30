'use client'
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { qtyChange } from "@/redux/features/cartSlice";

const CartItem = ({ item }) => {

    const dispatcher = useDispatch()
    return (
        <>

            <div className="flex flex-col sm:flex-row gap-5 bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition-all duration-300">

                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-40 sm:h-32 bg-gray-100 rounded-xl p-3 flex items-center justify-center overflow-hidden">
                    <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">

                    <div className="space-y-2">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                            {item.name}
                        </h4>

                        <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-red-600">
                                ₹{item.orginal_price}
                            </p>

                            {item.price && (
                                <p className="text-sm text-gray-400 line-through">
                                    ₹{item.price}
                                </p>
                            )}
                        </div>

                        {/* Stock Status */}
                        <p
                            className={`text-sm font-medium flex items-center gap-1
                ${item.stock ? "text-green-600" : "text-red-600"}
                `}
                        >
                            {item.stock ? "● In Stock" : "● Out of Stock"}
                        </p>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between mt-4">

                        {/* Quantity Box */}
                        <div className="flex items-center gap-4 border rounded-lg px-3 py-2 bg-gray-50">

                            <button
                                onClick={() =>
                                    dispatcher(qtyChange({ id: item.id, flag: "dec" }))
                                }
                                className="hover:text-red-500 transition cursor-pointer"
                            >
                                <FaMinus size={12} />
                            </button>

                            <span className="font-medium text-gray-700">
                                {item.qty}
                            </span>

                            <button
                                onClick={() =>
                                    dispatcher(qtyChange({ id: item.id, flag: "inc" }))
                                }
                                className="hover:text-green-600 transition cursor-pointer"
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>

                        {/* Optional Remove Button */}
                        <button className="text-sm text-red-500 hover:text-red-700 transition">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartItem;