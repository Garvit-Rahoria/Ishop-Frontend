import React from 'react'
import Breadcrumb from '../../global/Breadcrumb'

export default function PathSection() {
    return (
        <div className="space-y-2 mb-4">
            {/* Breadcrumb */}
            <Breadcrumb />

            {/* Title */}
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                EXPLORE ALL PRODUCTS
            </h2>
        </div>
    )
}
