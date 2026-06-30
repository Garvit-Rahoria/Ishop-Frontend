// 'use client'

// import { client } from "@/utils/helper";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";




// const OrderSummary = ({ user }) => {
//     const cart = useSelector((store) => store.cart);
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);
//     const addresses = user.addresses || [];
//     const [selectedAddress, setSelectedAddress] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('cod');
//     const { error, isLoading, Razorpay } = useRazorpay();



//     const handleOrder = async () => {
//         setLoading(true);

//         const orderData = {
//             address: addresses[selectedAddress],
//             paymentMethod
//         }
//         try {
//             const response = await client.post("/order/create", orderData)
//             if (paymentMethod == 'cod') {
//                 if (response.data.success) {
//                     router.push(`/thank-you?orderId=${response.data.orderId}`)
//                 }
//             } else {
//                 console.log(response.data)
//                 const options = {
//                     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                     currency: "INR",
//                     name: "Ishop Company",
//                     description: "Test Transaction",
//                     order_id: response.data.payment_order_Id, // Generate order_id on server
//                     handler: (response) => {
//                         console.log(response);
//                         alert("Payment Successful!");
//                     },
//                     prefill: {
//                         name: user.name ?? "John Doe",
//                         email: user.email,
//                         contact: 7976946314,
//                     },
//                     theme: {
//                         color: "#F37254",
//                     },
//                 };

//                 const razorpayInstance = new Razorpay(options);
//                 razorpayInstance.open();
//             };
            
//         } catch (error) {
//         console.log(error)
//     } finally {
//         setLoading(false)
//     }
// };



// return (
//     <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-7 h-fit">

//         {/* Glow Effects */}
//         <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/40 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100/30 rounded-full blur-3xl"></div>

//         {/* Header */}
//         <div className="relative flex items-center justify-between mb-6">

//             <div>

//                 <h2 className="text-2xl font-bold text-gray-800">
//                     Order Summary
//                 </h2>

//                 <p className="text-sm text-gray-500 mt-1">
//                     Review your final payment details
//                 </p>

//             </div>

//             <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
//                 Secure
//             </div>

//         </div>

//         {/* Divider */}
//         <div className="relative border-t border-gray-200 mb-5"></div>

//         {/* Pricing */}
//         <div className="relative space-y-4">

//             {/* Original Total */}
//             <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">

//                 <div>
//                     <p className="text-sm font-medium text-gray-500">
//                         Original Total
//                     </p>

//                     <p className="text-xs text-gray-400 mt-1">
//                         Before discounts
//                     </p>
//                 </div>

//                 <h3 className="text-lg font-bold text-gray-800">
//                     ₹{cart.original_total}
//                 </h3>

//             </div>

//             {/* Savings */}
//             <div className="flex items-center justify-between bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100">

//                 <div>
//                     <p className="text-sm font-medium text-emerald-700">
//                         Total Savings
//                     </p>

//                     <p className="text-xs text-emerald-500 mt-1">
//                         Discount applied
//                     </p>
//                 </div>

//                 <h3 className="text-lg font-bold text-emerald-600">
//                     ₹{cart.original_total - cart.final_total}
//                 </h3>

//             </div>

//         </div>

//         {/* Divider */}
//         <div className="relative border-t border-dashed border-gray-300 my-6"></div>

//         {/* Final Total */}
//         <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-5 text-white shadow-xl">

//             <div className="flex items-center justify-between">

//                 <div>

//                     <p className="text-sm text-gray-300">
//                         Final Amount
//                     </p>

//                     <h2 className="text-3xl font-bold mt-1">
//                         ₹{cart.final_total}
//                     </h2>

//                 </div>

//                 <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-semibold">
//                     Total
//                 </div>

//             </div>

//         </div>

//         {/* Order Button */}
//         <button
//             disabled={loading}
//             onClick={handleOrder}
//             className="group relative overflow-hidden w-full mt-7 bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white py-4 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
//         >

//             <span className="relative z-10">
//                 {loading ? 'Placing Order...' : 'Order Now'}
//             </span>

//             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

//         </button>

//         {/* Bottom Text */}
//         <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
//             Safe & secure payments powered by encrypted checkout
//         </p>

//     </div>
// );
// };

// export default OrderSummary;
