import Image from 'next/image'

const categories = [
    { name: 'iPhone (iOS)', items: 74, icon: '/icons/iphone.png' },
    { name: 'Android', items: 35, icon: '/icons/android.png' },
    { name: '5G Support', items: 12, icon: '/icons/5g.png' },
    { name: 'Gaming', items: 9, icon: '/icons/gaming.png' },
    { name: 'Xiaomi', items: 52, icon: '/icons/xiaomi.png' },
    { name: 'Accessories', items: 29, icon: '/icons/accessories.png' },
]

export default function CategoryQuickLinks() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">

                    <div className="relative w-10 h-10">
                        <Image
                            src={cat.icon}
                            alt={cat.name}
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium">{cat.name}</p>
                        <p className="text-xs text-gray-500">{cat.items} Items</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
