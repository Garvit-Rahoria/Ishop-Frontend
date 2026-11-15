import Link from 'next/link'
import {
    FaLaptop,
    FaDesktop,
    FaBriefcase,
    FaLaptopCode,
    FaMicrochip,
    FaRecycle,
} from 'react-icons/fa'

const links = [
    { name: 'Macbook', icon: FaLaptop, href: '/products' },
    { name: 'Gaming PC', icon: FaDesktop, href: '/products' },
    { name: 'Laptop Office', icon: FaBriefcase, href: '/products' },
    { name: 'Laptop 15"', icon: FaLaptopCode, href: '/products' },
    { name: 'M1 2023', icon: FaMicrochip, href: '/products' },
    { name: 'Secondhand', icon: FaRecycle, href: '/products' },
]

export default function LaptopQuickLinks() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {links.map((item) => {
                const Icon = item.icon
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/40 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition">
                            <Icon size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                {item.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Shop now</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
