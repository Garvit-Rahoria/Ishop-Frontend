'use client'

import {
    FiSearch,
    FiShoppingCart,
    FiUser,
    FiChevronDown,
    FiMenu,
    FiTruck,
    FiShield,
    FiX,
    FiLogOut,
    FiShoppingBag,
    FiGrid,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { emptyCart, lsToCart } from '@/redux/features/cartSlice'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { client } from '@/utils/helper'
import { clearAuthCookie } from '@/utils/authCookie'
import Swal from 'sweetalert2'
import ThemeToggle from './ThemeToggle'

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

    // Admin accounts do not use the customer shopping cart.
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
                className={`text-sm font-semibold transition px-2.5 py-1 rounded-lg ${
                    active
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/50 font-bold'
                        : 'text-gray-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
            >
                {label}
            </Link>
        )
    }

    const cartCount = cart?.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0
    const cartTotal = Number(cart?.final_total || 0)
    const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin'

    return (
        <header className="sticky top-0 left-0 z-40 w-full bg-white dark:bg-slate-900 shadow-xs border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
            {/* Slim Announcement Bar */}
            <div className="hidden lg:block bg-slate-900 text-slate-300 text-[12px] py-1.5 px-4 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <span className="flex items-center gap-1.5 text-slate-300">
                            <FiTruck className="text-teal-400" size={13} />
                            <span>Free Express Shipping across India on orders over <strong className="text-white">₹199</strong></span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <FiShield className="text-teal-400" size={13} />
                            <span>100% Genuine Brand Warranty</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400">
                        {isAdmin ? (
                            <Link href="/admin" className="text-teal-400 hover:text-teal-300 font-semibold transition">
                                Admin Dashboard
                            </Link>
                        ) : null}
                        <Link href="/profile" className="hover:text-white transition">
                            My Orders
                        </Link>
                        <Link href="/contact" className="hover:text-white transition">
                            Customer Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Compact Navbar */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4 lg:gap-8">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                            <span className="text-white text-lg font-black leading-none">S</span>
                        </div>
                        <div>
                            <h1 className="font-extrabold text-[17px] tracking-tight text-gray-900 dark:text-white leading-tight">
                                SWOO<span className="text-teal-600 dark:text-teal-400 font-normal ml-1 text-sm hidden sm:inline">TECH MART</span>
                            </h1>
                        </div>
                    </Link>

                    {/* Integrated Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 max-w-lg hidden sm:flex items-center relative"
                    >
                        <div className="relative w-full flex items-center">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search laptops, phones, smartwatches..."
                                className="w-full bg-gray-50 dark:bg-slate-800 hover:bg-gray-100/80 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 text-gray-800 dark:text-gray-100 text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 outline-none transition"
                            />
                            <button
                                type="submit"
                                aria-label="Submit search"
                                className="absolute right-1.5 w-7 h-7 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
                            >
                                <FiSearch size={13} />
                            </button>
                        </div>
                    </form>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden xl:flex items-center gap-1 shrink-0">
                        {navLink('/', 'Home')}
                        {navLink('/products', 'Products')}
                        {navLink('/about', 'About')}
                        {navLink('/contact', 'Contact')}
                    </nav>

                    {/* User & Cart Actions */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* Dark / Light Mode Toggle Button */}
                        <ThemeToggle />

                        {/* Account Menu */}
                        <div className="relative">
                            {user ? (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setOpen((v) => !v)}
                                        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold border border-teal-200/50 dark:border-teal-800/50">
                                            {user.name ? user.name[0].toUpperCase() : 'U'}
                                        </div>
                                        <div className="hidden md:block text-left">
                                            <p className="text-[10px] text-gray-400 dark:text-slate-400 leading-none">Welcome</p>
                                            <p className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate max-w-[90px] leading-tight">
                                                {user.name}
                                            </p>
                                        </div>
                                        <FiChevronDown size={13} className="text-gray-400 hidden sm:block" />
                                    </button>

                                    {open ? (
                                        <div className="absolute right-0 top-11 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                                            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                                                <p className="font-bold text-gray-800 dark:text-slate-100 truncate">{user.name}</p>
                                                <p className="text-gray-500 dark:text-slate-400 text-[11px] truncate">{user.email}</p>
                                            </div>
                                            {isAdmin ? (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold"
                                                >
                                                    <FiGrid size={13} />
                                                    <span>Admin Dashboard</span>
                                                </Link>
                                            ) : null}
                                            <Link
                                                href="/profile"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 font-medium"
                                            >
                                                <FiUser size={13} />
                                                <span>Profile &amp; Orders</span>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-left transition cursor-pointer"
                                            >
                                                <FiLogOut size={13} />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-teal-300 transition"
                                >
                                    <FiUser size={14} className="text-gray-500 dark:text-slate-400" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </Link>
                            )}
                        </div>

                        {/* Cart Pill */}
                        <Link
                            href="/cart"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition shadow-xs group"
                        >
                            <div className="relative">
                                <FiShoppingCart size={17} />
                                {cartCount > 0 ? (
                                    <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                                        {cartCount}
                                    </span>
                                ) : null}
                            </div>
                            <div className="hidden md:block leading-tight text-left">
                                <p className="text-[10px] text-teal-100 uppercase tracking-wider font-semibold">Cart</p>
                                <p className="text-xs font-extrabold text-white">
                                    ₹{cartTotal.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="xl:hidden p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            aria-label="Toggle navigation"
                        >
                            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="sm:hidden mt-2.5">
                    <form onSubmit={handleSearch} className="relative w-full">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products, brands..."
                            className="w-full bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100 text-xs px-3.5 py-2 pr-9 rounded-lg border border-gray-200 dark:border-slate-700 outline-none focus:border-teal-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-teal-600"
                        >
                            <FiSearch size={14} />
                        </button>
                    </form>
                </div>

                {/* Mobile Drawer */}
                {mobileOpen ? (
                    <div className="xl:hidden mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2 text-sm">
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200"
                        >
                            Products
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200"
                        >
                            Contact
                        </Link>
                        {user ? (
                            <Link
                                href="/profile"
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400"
                            >
                                My Profile &amp; Orders
                            </Link>
                        ) : null}

                        {/* Theme Toggle in Mobile */}
                        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between px-3 py-1">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Appearance</span>
                            <ThemeToggle showLabel />
                        </div>
                    </div>
                ) : null}
            </div>
        </header>
    )
}
