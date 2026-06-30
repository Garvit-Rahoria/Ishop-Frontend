// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// import { client } from '@/utils/helper';
// // import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";


// export default function CheckoutForm({ user }) {
//     // const { error, isLoading, Razorpay } = useRazorpay();


//     const addresses = user.addresses || []
//     const router = useRouter();
//     const [paymentMethod, setPaymentMethod] = useState('cod');
//     const [selectedAddress, setSelectedAddress] = useState(0);
//     const [loading, setLoading] = useState(false);
//     // Navigate to Profile Page
//     const handleAddAddress = () => {
//         router.push('/profile');
//     };

//     // Place Order
//     const handleOrder = async () => {
//         setLoading(true);

//         const orderData = {
//             address: addresses[selectedAddress],
//             paymentMethod
//         }

//     };

//     return (
//         // <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-[32px] p-4 md:p-8">

//             <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">

//                 {/* LEFT */}
//                 <div className="xl:col-span-2 space-y-8">

//                     {/* ADDRESS SECTION */}
//                     <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-8">

//                         {/* Header */}
//                         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

//                             <div>
//                                 <h2 className="text-3xl font-bold text-gray-800">
//                                     Delivery Address
//                                 </h2>

//                                 <p className="text-gray-500 mt-1">
//                                     Select your preferred delivery location
//                                 </p>
//                             </div>

//                             <button
//                                 onClick={handleAddAddress}
//                                 className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 hover:shadow-xl transition-all duration-300 text-white px-5 py-3 rounded-2xl font-semibold"
//                             >
//                                 + Add New Address
//                             </button>

//                         </div>

//                         {/* Address Cards */}
//                         <div className="grid grid-cols-1 gap-5">

//                             {
//                                 addresses.map((addr, index) => (

//                                     <div
//                                         key={index}
//                                         onClick={() => setSelectedAddress(index)}
//                                         className={`group relative overflow-hidden border-2 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                                    
//                                     ${selectedAddress === index
//                                                 ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-xl'
//                                                 : 'border-gray-200 bg-white hover:border-teal-300'
//                                             }
//                                 `}
//                                     >

//                                         {/* Selected Badge */}
//                                         {
//                                             selectedAddress === index && (
//                                                 <div className="absolute bottom-4 right-4 bg-teal-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
//                                                     Selected
//                                                 </div>
//                                             )
//                                         }

//                                         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

//                                             {/* Left */}
//                                             <div className="space-y-3">

//                                                 <div>
//                                                     <h3 className="text-xl font-bold text-gray-800">
//                                                         {addr.fullName}
//                                                     </h3>

//                                                     <p className="text-sm text-gray-500">
//                                                         Home Address
//                                                     </p>
//                                                 </div>

//                                                 <div className="space-y-1">

//                                                     <p className="text-gray-700 leading-relaxed">
//                                                         {addr.addressLine}
//                                                     </p>

//                                                     <p className="text-gray-600">
//                                                         {addr.city}, {addr.state} - {addr.pincode}
//                                                     </p>

//                                                 </div>

//                                             </div>

//                                             {/* Right */}
//                                             <div className="flex flex-col items-start md:items-end gap-3">

//                                                 <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium">
//                                                     +91 {addr.mobile}
//                                                 </div>

//                                             </div>

//                                         </div>

//                                     </div>
//                                 ))
//                             }

//                         </div>

//                     </div>

//                     {/* PAYMENT SECTION */}
//                     <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-8">

//                         {/* Header */}
//                         <div className="mb-8">

//                             <h2 className="text-3xl font-bold text-gray-800">
//                                 Payment Method
//                             </h2>

//                             <p className="text-gray-500 mt-1">
//                                 Choose your preferred payment option
//                             </p>

//                         </div>

//                         {/* Payment Cards */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                             {/* COD */}
//                             <label
//                                 className={`cursor-pointer border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                            
//                             ${paymentMethod === 'cod'
//                                         ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50'
//                                         : 'border-gray-200 bg-white hover:border-teal-300'
//                                     }
//                         `}
//                             >

//                                 <div className="flex items-start gap-4">

//                                     <input
//                                         type="radio"
//                                         checked={paymentMethod === 'cod'}
//                                         onChange={() => setPaymentMethod('cod')}
//                                         className="mt-1 w-5 h-5 accent-teal-500"
//                                     />

//                                     <div>

//                                         <h3 className="text-xl font-bold text-gray-800">
//                                             Cash on Delivery
//                                         </h3>

//                                         <p className="text-gray-500 mt-2 leading-relaxed">
//                                             Pay easily when your order arrives at your doorstep.
//                                         </p>

//                                     </div>

//                                 </div>

//                             </label>

//                             {/* ONLINE */}
//                             <label
//                                 className={`cursor-pointer border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                            
//                             ${paymentMethod === 'online'
//                                         ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50'
//                                         : 'border-gray-200 bg-white hover:border-teal-300'
//                                     }
//                         `}
//                             >

//                                 <div className="flex items-start gap-4">

//                                     <input
//                                         type="radio"
//                                         checked={paymentMethod === 'online'}
//                                         onChange={() => setPaymentMethod('online')}
//                                         className="mt-1 w-5 h-5 accent-teal-500"
//                                     />

//                                     <div>

//                                         <h3 className="text-xl font-bold text-gray-800">
//                                             Online Payment
//                                         </h3>

//                                         <p className="text-gray-500 mt-2 leading-relaxed">
//                                             Pay securely using UPI, Debit Card, Credit Card or Net Banking.
//                                         </p>

//                                     </div>

//                                 </div>

//                             </label>

//                         </div>

//                     </div>

//                 </div>

//             </div>

//         // </div>
//     );
// }