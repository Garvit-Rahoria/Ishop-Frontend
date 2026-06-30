'use client'
import Link from "next/link";
import { useSelector } from "react-redux";

const OrderSummary = () => {

    const cart = useSelector((store) => store.cart);
    console.log(cart)


    return (
        // <div className="border border-green-400 rounded-xl p-6 sticky top-24">

        //     <h3 className="font-semibold mb-6">Order Summary</h3>

        //     <div className="space-y-4 text-sm">

        //         <div className="flex justify-between">
        //             <span>Sub Total:</span>
        //             <span>₹{cart.original_total}</span>
        //         </div>

        //         <div className="flex justify-between">
        //             <span>Saving:</span>
        //             <span>₹{(cart.original_total - cart.final_total)}</span>
        //         </div>

        //         {/* <div className="flex justify-between">
        //             <span>Tax (GST 18%):</span>
        //             <span>₹{tax.toFixed(2)}</span>
        //         </div> */}

        //         <hr />

        //         <div className="flex justify-between font-semibold">
        //             <span>ORDER TOTAL:</span>
        //             <span>₹{cart.final_total}</span>
        //         </div>
        //     </div>

        //     <Link href="/checkout">
        //     <button className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg font-medium cursor-pointer">
        //         CHECKOUT
        //     </button>
        //     </Link>
        // </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm hover:shadow-md transition-all duration-300">

    {/* Heading */}
    <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
            Order Summary
        </h3>

        <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium">
            Secure
        </span>
    </div>

    {/* Price Details */}
    <div className="space-y-4 text-sm text-gray-700">

        <div className="flex justify-between items-center">
            <span>Sub Total</span>
            <span className="font-medium">
                ₹{cart.original_total}
            </span>
        </div>

        <div className="flex justify-between items-center">
            <span>You Save</span>

            <span className="font-semibold text-green-600">
                ₹{cart.original_total - cart.final_total}
            </span>
        </div>

        {/* Optional GST */}
        {/* 
        <div className="flex justify-between items-center">
            <span>GST (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
        </div>
        */}

        <div className="border-t pt-4 flex justify-between items-center">

            <span className="text-base font-semibold text-gray-800">
                Total
            </span>

            <span className="text-2xl font-bold text-teal-600">
                ₹{cart.final_total}
            </span>
        </div>
    </div>

    {/* Checkout Button */}
    <Link href="/checkout">
        <button className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg">
            Proceed to Checkout
        </button>
    </Link>

    {/* Extra Info */}
    <p className="text-xs text-gray-400 text-center mt-4">
        Safe & Secure Payments
    </p>
</div>
    );
};

export default OrderSummary;