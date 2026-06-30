// import Image from "next/image";
// import { FaArrowRight } from "react-icons/fa";
// import {
//     FiUser,
//     FiShoppingBag,
//     FiMapPin,
//     FiLock,
//     FiMail,
//     FiPhone,
// } from "react-icons/fi";

// const ProfileSidebar = () => {
//     return (
//         <div className="bg-white border border-gray-100 shadow-2xl rounded-[32px] overflow-hidden sticky top-24">

//             {/* Top Banner */}
//             <div className="relative h-32 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500">

//                 {/* Decorative Circles */}
//                 <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
//                 <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
//             </div>

//             {/* Profile Content */}
//             <div className="relative px-6 pb-8">

//                 {/* Profile Image */}
//                 <div className="flex justify-center">
//                     <div className="-mt-16 relative">
//                         <div className="w-32 h-32 rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl bg-white">
//                             <Image
//                                 src="https://t4.ftcdn.net/jpg/09/59/21/77/360_F_959217710_7tXOGV30gaUOjgGuMvnFzAwZhOOXbgvd.jpg"
//                                 alt="Profile"
//                                 width={300}
//                                 height={300}
//                                 className="object-cover w-full h-full"
//                             />
//                         </div>

//                         {/* Online Dot */}
//                         <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
//                     </div>
//                 </div>

//                 {/* User Info */}
//                 <div className="text-center mt-5">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         Rahul Sharma
//                     </h2>

//                     <p className="text-gray-500 text-sm mt-1">
//                         Premium Member
//                     </p>
//                 </div>

//                 {/* User Details Card */}
//                 <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">

//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
//                             <FiMail size={18} />
//                         </div>

//                         <div>
//                             <p className="text-xs text-gray-400">Email</p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 rahul@example.com
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
//                             <FiPhone size={18} />
//                         </div>

//                         <div>
//                             <p className="text-xs text-gray-400">Phone</p>
//                             <p className="text-sm font-medium text-gray-700">
//                                 +91 9876543210
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ProfileSidebar;