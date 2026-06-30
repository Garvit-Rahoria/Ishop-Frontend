// 'use client'

// import { client } from "@/utils/helper";
// import { useState, useEffect } from "react";

// const AccountInfoForm = ({ user }) => {
//     console.log(user, "user")

//     const [addAddress, setAddresses] = useState([])
//     const [form, setForm] = useState({
//         fullName: '',
//         mobile: '',
//         pincode: '',
//         addressLine: '',
//         city: '',
//         state: ''
//     });

//     // User data set
//     useEffect(() => {
//         if (user) {
//             setForm({
//                 fullName: user.fullName || '',
//                 mobile: user.mobile || '',
//                 pincode: user.pincode || '',
//                 addressLine: user.addressLine || '',
//                 city: user.city || '',
//                 state: user.state || ''
//             });
//         }
//     }, [user]);

//     // Handle Change
//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     // Add Address
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         client.post('/user/addAddress', form)

//             .then((res) => {
//                 console.log(res)
//                 setAddresses(res.data.addAddress)
//                 notify(res.data.message, true)

//                 setForm({
//                     fullName: '',
//                     mobile: '',
//                     pincode: '',
//                     addressLine: '',
//                     city: '',
//                     state: ''
//                 })
//             })
//             .catch((err)=> {
//                 console.log(err)
//             })



//     };

//     return (    
//         <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 border border-gray-100">

//             <div className="mb-8">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                     Account Information
//                 </h2>

//                 <p className="text-gray-500 mt-1">
//                     Manage your personal and address details
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">

//                 {/* Full Name */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Full Name *
//                     </label>

//                     <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={form.fullName}
//                         onChange={handleChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
//                     />
//                 </div>

//                 {/* Email & Mobile */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Mobile Number *
//                         </label>

//                         <input
//                             type="tel"
//                             name="mobile"
//                             placeholder="Enter mobile number"
//                             value={form.mobile}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
//                         />
//                     </div>

//                 </div>

//                 {/* Address */}
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Address *
//                     </label>

//                     <textarea
//                         name="addressLine"
//                         rows="4"
//                         placeholder="Enter your full address"
//                         value={form.addressLine}
//                         onChange={handleChange}
//                         className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
//                     ></textarea>
//                 </div>

//                 {/* City, State, Pincode */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             City *
//                         </label>

//                         <input
//                             type="text"
//                             name="city"
//                             placeholder="Enter city"
//                             value={form.city}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             State *
//                         </label>

//                         <input
//                             type="text"
//                             name="state"
//                             placeholder="Enter state"
//                             value={form.state}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Pincode *
//                         </label>

//                         <input
//                             type="text"
//                             name="pincode"
//                             placeholder="Enter pincode"
//                             value={form.pincode}
//                             onChange={handleChange}
//                             className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
//                         />
//                     </div>

//                 </div>

//                 {/* Buttons */}
//                 <div className="flex flex-wrap gap-4 pt-2">

//                     <button
//                         type="submit"
//                         className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition duration-300"
//                     >
//                         Save Account
//                     </button>

                    

//                 </div>

//             </form>
//         </div>
//     );
// };

// export default AccountInfoForm;