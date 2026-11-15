'use client'
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { qtyChange, removeItem } from "@/redux/features/cartSlice";
import { resolveMediaUrl } from "@/utils/media";

const CartItem = ({ item }) => {
    const dispatcher = useDispatch()
    const currentPrice = Number(item.final_price || item.orginal_price || 0);
    const originalPrice = Number(item.orginal_price || 0);

    return (
        <div className="flex flex-col sm:flex-row gap-5 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300">
            {/* Product Image */}
            <div className="relative w-full sm:w-28 h-28 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                <img
                    src={resolveMediaUrl("", item.thumbnail)}
                    alt={item.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
                />
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                        {item.name}
                    </h4>

                    <div className="flex items-center gap-3">
                        <p className="text-lg font-black text-teal-600 dark:text-teal-400">
                            ₹{currentPrice.toLocaleString('en-IN')}
                        </p>

                        {originalPrice > currentPrice && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 line-through">
                                ₹{originalPrice.toLocaleString('en-IN')}
                            </p>
                        )}

                        <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                item.stock
                                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50"
                                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50"
                            }`}
                        >
                            {item.stock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {/* Quantity Stepper */}
                    <div className="inline-flex items-center gap-3 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800">
                        <button
                            type="button"
                            onClick={() =>
                                dispatcher(qtyChange({ id: item.id, flag: "dec" }))
                            }
                            className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition p-1 cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            <FaMinus size={10} />
                        </button>

                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200 min-w-[20px] text-center">
                            {item.qty}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                dispatcher(qtyChange({ id: item.id, flag: "inc" }))
                            }
                            className="text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition p-1 cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <FaPlus size={10} />
                        </button>
                    </div>

                    {/* Subtotal & Remove Button */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 hidden sm:inline">
                            ₹{(currentPrice * (item.qty || 1)).toLocaleString('en-IN')}
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                dispatcher(removeItem({ id: item.id ?? item._id }))
                            }
                            className="text-xs font-semibold text-rose-500 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1.5 transition px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                            <FaTrashAlt size={12} />
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
