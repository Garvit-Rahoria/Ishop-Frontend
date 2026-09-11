'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export default function PriceFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const MIN_LIMIT = 0
    const MAX_LIMIT = 200000

    const minQuery = Number(searchParams.get('min_price'))
    const maxQuery = Number(searchParams.get('max_price'))

    const [min, setMin] = useState(
        Number.isFinite(minQuery) && minQuery > 0 ? minQuery : MIN_LIMIT
    )
    const [max, setMax] = useState(
        Number.isFinite(maxQuery) && maxQuery > 0 ? maxQuery : MAX_LIMIT
    )

    const handleMinChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value, 10)
        setMin(value)
    }

    const handleMaxChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value, 10)
        setMax(value)
    }

    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (min !== '' && max !== '' && Number(min) > Number(max)) {
            alert('Min price cannot be greater than max price')
            return
        }

        if (
            min === '' ||
            max === '' ||
            (Number(min) === MIN_LIMIT && Number(max) === MAX_LIMIT)
        ) {
            params.delete('min_price')
            params.delete('max_price')
        } else {
            params.set('min_price', String(min))
            params.set('max_price', String(max))
        }
        params.delete('page')

        router.push(`?${params.toString()}`)
    }

    const clearFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('min_price')
        params.delete('max_price')
        params.delete('page')
        setMin(MIN_LIMIT)
        setMax(MAX_LIMIT)
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="bg-gray-200 p-3 rounded-lg shadow-sm">
            <h4 className="font-semibold text-sm text-gray-800 mb-3">BY PRICE (₹)</h4>

            <div className="flex items-end justify-evenly gap-2">
                <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-500 mb-1">MIN</label>
                    <input
                        type="number"
                        min={0}
                        value={min}
                        onChange={handleMinChange}
                        placeholder="0"
                        className="w-20 h-8 border rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                </div>

                <span className="text-gray-400 text-xs mb-1">—</span>

                <div className="flex flex-col items-center">
                    <label className="text-[10px] text-gray-500 mb-1">MAX</label>
                    <input
                        type="number"
                        min={0}
                        value={max}
                        onChange={handleMaxChange}
                        placeholder="200000"
                        className="w-20 h-8 border rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                </div>
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    type="button"
                    onClick={clearFilter}
                    className="flex-1 border border-gray-300 cursor-pointer bg-white text-gray-600 py-1 text-xs rounded hover:bg-gray-100"
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={applyFilter}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 cursor-pointer text-white py-1 text-xs rounded"
                >
                    Apply
                </button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
                ₹{min} – ₹{max}
            </div>
        </div>
    )
}
