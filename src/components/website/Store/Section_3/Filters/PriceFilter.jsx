'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export default function PriceFilter() {

    const router = useRouter()
    const searchParams = useSearchParams()

    const MIN_LIMIT = 0
    const MAX_LIMIT = 100

    // Safe query parsing
    const minQuery = Number(searchParams.get('min_price')) || MIN_LIMIT
    const maxQuery = Number(searchParams.get('max_price')) || MAX_LIMIT

    const [min, setMin] = useState(isNaN(minQuery) ? MIN_LIMIT : minQuery)
    const [max, setMax] = useState(isNaN(maxQuery) ? MAX_LIMIT : maxQuery)

    // Handle MIN change
    const handleMinChange = (e) => {
        let value = e.target.value === "" ? "" : parseInt(e.target.value)

        // if (value !== "") {
        //     if (value < MIN_LIMIT) value = MIN_LIMIT
        //     if (value > MAX_LIMIT) value = MAX_LIMIT
        // }

        setMin(value)
    }

    // Handle MAX change
    const handleMaxChange = (e) => {
        let value = e.target.value === "" ? "" : parseInt(e.target.value)

        // if (value !== "") {
        //     if (value < MIN_LIMIT) value = MIN_LIMIT
        //     if (value > MAX_LIMIT) value = MAX_LIMIT
        // }

        setMax(value)
    }

    // Apply Filter
    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        // validation
        if (min !== "" && max !== "" && min > max) {
            alert("Min price cannot be greater than max price")
            return
        }

        if (
            min === "" ||
            max === "" ||
            (min === MIN_LIMIT && max === MAX_LIMIT)
        ) {
            params.delete('min_price')
            params.delete('max_price')
        } else {
            params.set('min_price', min)
            params.set('max_price', max)
        }

        router.push(`?${params.toString()}`)
        // router.refresh() 
    }

    // Clear filter
    const clearFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        params.delete('min_price')
        params.delete('max_price')

        setMin(MIN_LIMIT)
        setMax(MAX_LIMIT)

        router.push(`?${params.toString()}`)
        // router.refresh() 
    }

    return (
        <div className="bg-gray-200 p-3 rounded-lg shadow-sm">
            <h4 className="font-semibold text-sm text-gray-800 mb-3">BY PRICE</h4>

            {/* Inputs */}
            <div className="flex items-end justify-evenly gap-2">

                {/* MIN */}
                <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-500 mb-1">MIN</label>
                    <input
                        type="number"
                        value={min}
                        onChange={handleMinChange}
                        placeholder="0"
                        className="w-16 h-8 border rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                </div>

                <span className="text-gray-400 text-xs mb-1">—</span>

                {/* MAX */}
                <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-500 mb-1">MAX</label>
                    <input
                        type="number"
                        value={max}
                        onChange={handleMaxChange}
                        placeholder="1000"
                        className="w-16 h-8 border rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-3">
                <button
                    onClick={clearFilter}
                    className="flex-1 border border-gray-300 cursor-pointer bg-white text-gray-600 py-1 text-xs rounded hover:bg-gray-100">
                    Clear
                </button>

                <button
                    onClick={applyFilter}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 cursor-pointer text-white py-1 text-xs rounded">
                    Apply
                </button>
            </div>
            <div className='mt-3 text-sm text-gray-600'>
                    ₹{min} - ₹{max}
            </div>
        </div>
    )
}