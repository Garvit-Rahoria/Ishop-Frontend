'use client'

import {
    FiSearch,
    FiShoppingCart,
    FiUser,
    FiChevronDown,
    FiMenu,
    FiTruck,
    FiShield,
    FiHeadphones,
    FiGrid,
    FiX,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { emptyCart, lsToCart } from '@/redux/features/cartSlice'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdLogout } from 'react-icons/md'
import { client } from '@/utils/helper'
import { clearAuthCookie } from '@/utils/authCookie'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function Header({ user }) {
    const cart = useSelector((store) => store.cart)
    const dispatcher = useDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        dispatcher(lsToCart())
    }, [dispatcher])

    // Admin accounts do not use the customer shopping cart. Clear any stale
    // cart left in this browser from an earlier test session.
    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'superAdmin') {
            dispatcher(emptyCart())
        }
    }, [dispatcher, user?.role])

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Log out?',
            text: 'Are you sure you want to log out of your account?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        })

        if (!result.isConfirmed) return

        dispatcher(emptyCart())
        localStorage.removeItem('jwt')
        setOpen(false)

        // Do not block navigation on a slow or CORS-blocked API request.
        void Promise.allSettled([
            client.post('/user/logout'),
            clearAuthCookie(),
        ])

        window.location.replace('/login')
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const q = searchQuery.trim()
        if (!q) {
            router.push('/products')
            return
        }
        router.push(`/products?q=${encodeURIComponent(q)}`)
        setMobileOpen(false)
    }

    const navLink = (href, label) => {
        const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
        return (
            <Link
                href={href}
                className={`relative text-[15px] font-medium transition ${
                    active ? 'text-teal-500' : 'text-gray-700 hover:text-teal-500'
                }`}
            >
                {label}
                {active ? (
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-teal-500 rounded-full" />
                ) : null}
            </Link>
        )
    }

    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0
    const cartTotal = Number(cart?.final_total || 0)

    return (
        <header className="sticky top-0 left-0 z-40 w-full bg-white shadow-sm">
            {/* Top utility bar */}
            <div className="hidden lg:block border-b border-gray-100 bg-[#f7f8fa] text-[13px] text-gray-600">
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <FiTruck className="text-teal-500" size={15} />
                            Free Shipping on orders over <strong className="text-gray-800">₹199</strong>
                        </span>
                        <span className="flex items-center gap-2">
                            <FiShield className="text-teal-500" size={15} />
                            30 Days Money Back Guarantee
                        </span>
                    </div>

                    <div className="flex items-center gap-5 font-medium">
                        <Link href="/profile" className="hover:text-teal-500 transition">
                            My Orders
                        </Link>
                        <Link href="/contact" className="hover:text-teal-500 transition">
                            Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="w-11 h-11 rounded-full bg-teal-500 flex items-center justify-center shadow-md">
                            <span className="text-white text-xl font-black leading-none">S</span>
                        </div>
                        <div>
                            <h2 className="font-extrabold text-[18px] leading-5 tracking-wide text-gray-800">
                                SWOO TECH MART
                            </h2>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-8">
                        {navLink('/', 'Home')}
                        {navLink('/about', 'About')}
                        {navLink('/products', 'Products')}
                        {navLink('/contact', 'Contact')}
                    </nav>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden md:flex items-center gap-2 relative">
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <FiUser size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-400 leading-none mb-1">Welcome</p>
                                {user ? (
                                    <button
                                        type="button"
                                        onClick={() => setOpen((v) => !v)}
                                        className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-teal-500"
                                    >
                                        {user.name}
                                        <FiChevronDown size={14} />
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                                        <Link href="/login" className="hover:text-teal-500">Login</Link>
                                        <span>/</span>
                                        <Link href="/register" className="hover:text-teal-500">Register</Link>
                                    </div>
                                )}
                            </div>

                            {user && open ? (
                                <div className="absolute right-0 top-12 w-44 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-3 text-sm hover:bg-gray-50"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-sm flex items-center justify-between hover:bg-red-50"
                                    >
                                        Logout
                                        <MdLogout />
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        <div className="hidden md:block h-8 w-px bg-gray-200" />

                        <Link href="/cart" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal-50 transition">
                                    <FiShoppingCart size={20} className="text-gray-700 group-hover:text-teal-500" />
                                </div>
                                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[11px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-semibold shadow">
                                    {cartCount}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[11px] text-gray-400 leading-none mb-1">Cart</p>
                                <span className="font-semibold text-sm text-gray-800">
                                    ₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </Link>

                        <button
                            type="button"
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>

                {mobileOpen ? (
                    <div className="lg:hidden border-t border-gray-100 px-4 py-3 space-y-3 bg-white">
                        <Link href="/" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
                        <Link href="/about" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>About</Link>
                        <Link href="/products" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Products</Link>
                        <Link href="/contact" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
                        {!user ? (
                            <div className="flex gap-3 pt-2">
                                <Link href="/login" className="text-teal-600 font-semibold">Login</Link>
                                <Link href="/register" className="text-teal-600 font-semibold">Register</Link>
                            </div>
                        ) : (
                            <Link href="/profile" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Profile</Link>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Teal search / features bar */}
            <div className="bg-teal-500">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
                    <div className="flex-1 flex items-center gap-3">
                        <Link
                            href="/products"
                            className="hidden sm:flex items-center gap-2 bg-white text-gray-800 text-sm font-semibold px-4 py-3 rounded-xl shrink-0 hover:bg-gray-50 transition"
                        >
                            <FiGrid size={16} className="text-teal-500" />
                            All Products
                        </Link>

                        <form
                            onSubmit={handleSearch}
                            className="flex-1 bg-white rounded-full overflow-hidden flex items-center shadow-sm min-w-0"
                        >
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products, brands and more..."
                                className="flex-1 px-5 py-3 outline-none text-sm text-gray-700 min-w-0"
                                aria-label="Search products"
                            />
                            <button
                                type="submit"
                                className="m-1.5 w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition shrink-0"
                                aria-label="Search"
                            >
                                <FiSearch size={18} />
                            </button>
                        </form>
                    </div>

                    <div className="hidden md:flex items-center justify-between xl:justify-end gap-6 xl:gap-8 text-white text-sm">
                        <div className="flex items-center gap-2">
                            <FiTruck size={20} />
                            <div className="leading-tight">
                                <p className="font-semibold">Free Shipping</p>
                                <p className="text-white/85 text-xs">On orders over ₹199</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiShield size={20} />
                            <div className="leading-tight">
                                <p className="font-semibold">Secure Payment</p>
                                <p className="text-white/85 text-xs">100% secure payment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiHeadphones size={20} />
                            <div className="leading-tight">
                                <p className="font-semibold">24/7 Support</p>
                                <p className="text-white/85 text-xs">We&apos;re here to help</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
