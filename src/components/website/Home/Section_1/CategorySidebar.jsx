// "use client"
import { getCategories } from '@/api/api-call'
import Link from 'next/link';
import {
    FiMonitor,
    FiCpu,
    FiSmartphone,
    FiTablet,
    FiCamera,
} from 'react-icons/fi'
import { BsSmartwatch } from "react-icons/bs";
import { FaHeadphonesSimple } from "react-icons/fa6";



// const categoryIcons = {
//     Laptops: <FiMonitor size={18} />,
//     'Headphones': <FaHeadphonesSimple size={18} />,
//     'Cell Phones': <FiSmartphone size={18} />,
//     'Watches': <BsSmartwatch size={18} />,
//     Cameras: <FiCamera size={18} />,
// }

export default async function CategorySidebar() {
    const categorydata = await getCategories({ status: true, is_home: true, limit: 5, })
    const imageUrl = categorydata?.meta?.imageBaseUrl;
    // console.log(imageUrl)
    const categories = categorydata.data || []
    return (
        <aside className="lg:col-span-1 bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Category</h3>
            <ul className="space-y-3">
                {categories.map((cat, index) => (
                    <li key={index}>
                        <Link
                            href={`/products/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-3 rounded-lg border hover:border-teal-500 transition cursor-pointer"
                        >
                            {/* LEFT SIDE */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={`${imageUrl}/${cat.image}`}
                                    alt={cat.name}
                                    className="w-6 h-6 rounded-md object-cover"
                                />
                                <span className="text-sm font-medium">
                                    {cat.name}
                                </span>
                            </div>

                            {/* RIGHT BADGE */}
                            <span className="text-xs bg-teal-100 text-teal-600 w-6 h-6 flex items-center justify-center rounded-full">
                                {cat.count || 0}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
