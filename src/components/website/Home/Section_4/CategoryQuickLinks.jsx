import Link from 'next/link'
import {
    FaApple,
    FaAndroid,
    FaWifi,
    FaGamepad,
    FaMobileAlt,
    FaHeadphones,
} from 'react-icons/fa'

const categories = [
    { name: 'iPhone (iOS)', icon: FaApple, href: '/products' },
    { name: 'Android', icon: FaAndroid, href: '/products' },
    { name: '5G Support', icon: FaWifi, href: '/products' },
    { name: 'Gaming', icon: FaGamepad, href: '/products' },
    { name: 'Mobiles', icon: FaMobileAlt, href: '/products' },
    { name: 'Accessories', icon: FaHeadphones, href: '/products' },
]

export default function CategoryQuickLinks() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((cat) => {
                const Icon = cat.icon
                return (
                    <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/40 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition">
                            <Icon size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                                {cat.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Shop now</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
