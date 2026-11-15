'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ROUTE_LABELS = {
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    contact: 'Contact Us',
    profile: 'My Profile',
    products: 'All Products',
    about: 'About Us',
    login: 'Login',
    register: 'Register',
}

const Breadcrumb = ({ items, title }) => {
    const pathname = usePathname()

    let trail = []
    if (Array.isArray(items) && items.length > 0) {
        trail = items
    } else {
        trail = [{ label: 'Home', href: '/' }]
        const segments = (pathname || '')
            .split('/')
            .filter(Boolean)

        let currPath = ''
        segments.forEach((seg, index) => {
            currPath += `/${seg}`
            const isLast = index === segments.length - 1
            const label = title && isLast
                ? title
                : ROUTE_LABELS[seg.toLowerCase()] || decodeURIComponent(seg).replace(/[-_]/g, ' ')

            trail.push({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                href: isLast ? null : currPath,
            })
        })
    }

    if (trail.length <= 1) return null

    return (
        <section className="bg-transparent py-2">
            <div className="max-w-7xl mx-auto">
                <nav aria-label="Breadcrumb" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center gap-2 shadow-2xs transition-colors">
                    {trail.map((crumb, idx) => {
                        const isLast = idx === trail.length - 1
                        return (
                            <span key={idx} className="flex items-center gap-2">
                                {idx > 0 && <span className="text-slate-400 dark:text-slate-600">/</span>}
                                {isLast || !crumb.href ? (
                                    <span className="text-slate-900 dark:text-slate-100 font-bold">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link href={crumb.href} className="hover:text-teal-600 dark:hover:text-teal-400 transition font-medium">
                                        {crumb.label}
                                    </Link>
                                )}
                            </span>
                        )
                    })}
                </nav>
            </div>
        </section>
    )
}

export default Breadcrumb
