import { getProducts } from '@/api/api-call'
import Image from 'next/image'

const topCategories = [
    { name: 'Laptops', image: '/categories/laptops.png' },
    { name: 'PC Gaming', image: '/categories/pc-gaming.png' },
    { name: 'Headphones', image: '/categories/headphones.png' },
    { name: 'Monitors', image: '/categories/monitors.png' },
]

export default async function TopCategories() {

    const productData = await getProducts({ status: true, is_top: true, limit: 4 })
    const imageUrl = productData?.meta?.imageBaseUrl;

    const product = productData.data || []


    return (
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Top Categories</h3>
                <span className="text-sm text-gray-500 cursor-pointer hover:text-teal-500">
                    View All
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {product.map((cat, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center rounded-lg p-4 hover:shadow transition cursor-pointer"
                    >
                        <div className="relative w-16 h-16 mb-3">
                            <img
                                src={`${imageUrl}/${cat.image}`}
                                alt={cat.name}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
