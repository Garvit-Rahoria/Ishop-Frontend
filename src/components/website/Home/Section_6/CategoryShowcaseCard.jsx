import Image from 'next/image'

export default function CategoryShowcaseCard({
    title,
    bannerImage,
    bannerText,
    categories,
}) {
    return (
        <div className="bg-white rounded-xl border">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="text-sm font-semibold uppercase">
                    {title}
                </h4>
                <span className="text-xs text-gray-500 hover:text-teal-500 cursor-pointer">
                    View All
                </span>
            </div>

            {/* Banner */}
            <div className="relative h-32">
                <Image
                    src={bannerImage}
                    alt={title}
                    fill
                    className="object-cover"
                />

                {bannerText && (
                    <div className="absolute inset-0 bg-black/30 flex items-center px-4">
                        <p className="text-white text-sm font-medium leading-snug">
                            {bannerText}
                        </p>
                    </div>
                )}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-6 p-4">
                {categories.map((item, index) => (
                    <div key={index} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                            <Image
                                src={item.icon}
                                alt={item.name}
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>

                        <p className="text-sm font-medium">
                            {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {item.items} Items
                        </p>
                    </div>
                ))}
            </div>

        </div>
    )
}
