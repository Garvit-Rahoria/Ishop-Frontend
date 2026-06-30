import Image from 'next/image'

const categories = [
    { name: 'Macbook', items: 74, icon: '/icons/macbook.png' },
    { name: 'Gaming PC', items: 5, icon: '/icons/gaming-pc.png' },
    { name: 'Laptop Office', items: 22, icon: '/icons/laptop-office.png' },
    { name: 'Laptop 15"', items: 55, icon: '/icons/laptop-15.png' },
    { name: 'M1 2023', items: 32, icon: '/icons/m1.png' },
    { name: 'Secondhand', items: 16, icon: '/icons/secondhand.png' },
]

export default function LaptopQuickLinks() {
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
