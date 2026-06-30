"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react'

export default function BrandFilter({ brands }) {

    const router = useRouter()
    const searchParams = useSearchParams();
    const select_brand = searchParams.get("brand_slug")
    // console.log(select_brand)

    function filterHandler(slug) {
        const query = new URLSearchParams(searchParams.toString());
        if (slug == select_brand) {
            query.delete("brand_slug")
        } else {
            query.set("brand_slug", slug)
        }
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh()
    }

    function clearBrandFunction() {
        const query = new URLSearchParams(searchParams.toString());
        query.delete("brand_slug")
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh();
    }

    return (
        
    //     <div>
    //         <h4 className="font-medium text-black mb-3">BY BRAND~</h4>

    //         <button
    //             onClick={clearBrandFunction}
    //             disabled={!select_brand}
    //             className={`w-full border rounded-md py-2 mb-2 font-medium transition
    //                     ${select_brand
    //                     ? "cursor-pointer hover:bg-red-500 hover:text-white"
    //                     : "cursor-not-allowed opacity-50"}
    // `}
    //         >
    //             Clear Brands
    //         </button>

    //         <div className="flex flex-col  text-gray-600">

    //             {brands.map((brand) => {
    //                 const isActive = select_brand === brand.slug;

    //                 return (
    //                     <div
    //                         key={brand._id}
    //                         onClick={() => filterHandler(brand.slug)}
    //                         className={`
    //                                 flex justify-between items-center
    //                                 ml-3 px-2 py-1 rounded-md cursor-pointer
    //                                 transition-all duration-200
    //                                 ${isActive
    //                                 ? "bg-teal-500 text-white"
    //                                 : "hover:bg-teal-100 hover:text-black"}
    //                                  `}
    //                     >
    //                         <p className="text-sm">{brand.name}</p>
    //                         <p className="text-xs">{brand.count || 0}</p>
    //                     </div>
    //                 );
    //             })}

    //         </div>
    //     </div>
    <div>
    <h4 className="font-medium text-black mb-3">BY BRAND~</h4>

    <button
        onClick={clearBrandFunction}
        disabled={!select_brand}
        className={`w-full border rounded-md py-2 mb-4 font-medium transition
        ${select_brand
                ? "cursor-pointer hover:bg-red-500 hover:text-white"
                : "cursor-not-allowed opacity-50"}
        `}
    >
        Clear Brands
    </button>

    <div className="flex flex-wrap gap-3 text-gray-600">

        {brands.map((brand) => {
            const isActive = select_brand === brand.slug;

            return (
                <div
                    key={brand._id}
                    onClick={() => filterHandler(brand.slug)}
                    className={`
                        flex items-center gap-2
                        px-2 py-1 rounded-2xl cursor-pointer
                        transition-all duration-200 border
                        ${isActive
                            ? "bg-teal-500 text-white"
                            : "hover:bg-teal-100 hover:text-black"}
                    `}
                >
                    <p className="text-xs">{brand.name}</p>

                    {brand.count ? (
                        <p className="text-xs">({brand.count})</p>
                    ) : null}
                </div>
            );
        })}

    </div>
</div>

    )
}
