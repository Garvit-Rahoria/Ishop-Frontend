// 'use client'
import { getBrands } from '@/api/api-call'

export default async function FeaturedBrands() {

    const brandData = await getBrands({ status: true, is_popular: true, limit: 10 })
    const imageUrl = brandData?.meta?.imageBaseUrl;
    // console.log(imageUrl)
    const brand = brandData.data || []

    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Featured Brands</h3>
                <span className="text-sm text-gray-500 cursor-pointer hover:text-teal-500">
                    View All
                </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 items-center">
                {/* {brand.map((brd, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center h-14 rounded-lg hover:shadow transition bg-white"
                    >
                        <img
                            src={brd.image}
                            alt={brd.name}
                            width={90}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                ))} */}

                {brand.map((brd, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center h-14 rounded-lg hover:shadow transition bg-white"
                    >
                        {brd?.image ? (
                            <img
                                src={`${imageUrl}/${brd.image}`}
                                alt={brd.name}
                                width={90}
                                height={40}
                                className="object-contain rounded-2xl"
                            />
                        ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
