"use client"
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCircleCheck } from "react-icons/fa6";

export default function ColorFilter({ colors }) {

    const router = useRouter()
    const searchParams = useSearchParams();
    let select_color = searchParams.get("color_slug")?searchParams.get("color_slug").split(",") : []

    function filterHandler(slug) {  
        let updatedColors = []

        if(select_color.includes(slug)){
            updatedColors = select_color.filter((c)=> c !== slug)  //remove
        }else{
            updatedColors = [...select_color,slug]
        }

        const query = new URLSearchParams(searchParams.toString());
        if (updatedColors.length>0) {
            query.set("color_slug" ,updatedColors.join(","))
        }else{
            query.delete("color_slug")
        }
        router.push(`?${query.toString()}`, { scroll: false })
    }

    function clearColorFunction() {
        const query = new URLSearchParams(searchParams.toString());
        query.delete("color_slug")
        router.push(`?${query.toString()}`, { scroll: false })
        router.refresh();
    }

    return (
        <div>
            <div className='flex justify-between items-start'>
                <h4 className="font-semibold mb-3">BY COLOR~</h4>

            <button onClick={clearColorFunction} className='cursor-pointer font-medium hover:text-red-500 hover:underline'>Clear</button>

            </div>
            <div className="flex flex-wrap gap-2">

                {colors.map((color) => {
                    const selectColor = select_color.includes(color.slug)
                    return (

                        <button
                            onClick={() => filterHandler(color.slug)}
                            key={color._id}
                            className="w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center hover:scale-110 duration-150 "
                            style={{ backgroundColor: color.color_code }}
                        > 
                            <FaCircleCheck size={10} className={` ${selectColor ? "opacity-100" : "opacity-0"} text-white `} />
                        </button>

                    )
                })}
            </div>
        </div>
    )
}
