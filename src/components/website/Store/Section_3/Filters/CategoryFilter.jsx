"use client"
import React from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CategoryFilter({ categories }) {
    const pathname = usePathname();

    const isAllActive = pathname === "/products";

    return (
        // <div>
        //     <h4 className="font-semibold mb-3">CATEGORIES</h4>

        //     <Link href={"/products"}>
        //     <button className="w-full bg-white border rounded-md py-2 mb-4 font-medium cursor-pointer">
        //         All Categories
        //     </button>
        //     </Link>

        //     <p className="font-medium text-black mb-1">
        //         BY CATEGORY
        //     </p>

        //     <div className="space-y-1 text-gray-600">

        //         {categories.map((cat) => {
        //             const isActive = pathname === `/products/${cat.slug}`; 

        //             return (
        //                 <Link key={cat._id} href={`/products/${cat.slug}`}>
        //                     <p
        //                         className={`flex justify-between ml-3 cursor-pointer px-1.5 py-0.5 rounded hover:text-black
        //                         ${isActive ? "bg-teal-500 text-white" : ""}`}
        //                     >
        //                         <span>{cat.name}</span>
        //                         <span>{cat.count || 0}</span>
        //                     </p>
        //                 </Link>
        //             );
        //         })}

        //     </div>
        // </div>

        // <div>
        //     <h4 className="font-medium text-black mb-3">BY CATEGORY~</h4>

        //     {/* ALL CATEGORIES */}
        //     <Link href="/products">
        //         <button
        //             className={`w-full border rounded-md py-2 mb-2 font-medium cursor-pointer transition
        //                 ${isAllActive
        //                     ? "bg-teal-500 text-white"
        //                     : "bg-white hover:bg-gray-100"
        //                 }`}
        //         >
        //             All Categories
        //         </button>
        //     </Link>

        //     <div className="flex flex-col space-y-1 text-gray-600">

        //         {categories.map((cat) => {
        //             const isActive = pathname === `/products/${cat.slug}`;

        //             return (
        //                 <Link key={cat._id} href={`/products/${cat.slug}`}>
        //                     <div
        //                         className={`
        //                                flex justify-between items-center
        //                                ml-3 px-2 py-1 rounded-md cursor-pointer
        //                                transition-all duration-200
        //                                ${isActive
        //                                 ? "bg-teal-500 text-white shadow-sm"
        //                                 : "hover:bg-teal-100  hover:text-black"}
        //                                 `}
        //                     >
        //                         <span className="text-sm">{cat.name}</span>
        //                         <span className="text-xs">{cat.count || 0}</span>
        //                     </div>
        //                 </Link>
        //             );
        //         })}

        //     </div>
        // </div>

        <div>
    <h4 className="font-medium text-black mb-3">BY CATEGORY~</h4>

    {/* ALL CATEGORIES */}
    <Link href="/products">
        <button
            className={`w-full border rounded-md px-4 py-2 mb-4 font-medium cursor-pointer transition
            ${isAllActive
                    ? "bg-teal-500 text-white"
                    : "bg-white hover:bg-gray-100"}
            `}
        >
            All Categories
        </button>
    </Link>

    <div className="flex flex-wrap gap-3 text-gray-600">

        {categories.map((cat) => {
            const isActive = pathname === `/products/${cat.slug}`;

            return (
                <Link key={cat._id} href={`/products/${cat.slug}`}>
                    <div
                        className={`
                            flex items-center gap-2
                            px-2 py-1 rounded-2xl cursor-pointer border
                            transition-all duration-200
                            ${isActive
                                ? "bg-teal-500 text-white shadow-sm"
                                : "hover:bg-teal-100 hover:text-black"}
                        `}
                    >
                        <span className="text-xs">{cat.name}</span>

                        {cat.count ? (
                            <span className="text-xs">({cat.count})</span>
                        ) : null}
                    </div>
                </Link>
            );
        })}

    </div>
</div>
    )
}
