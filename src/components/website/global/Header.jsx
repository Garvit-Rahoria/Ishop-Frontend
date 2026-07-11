'use client'

import { FiSearch, FiShoppingCart, FiUser, FiChevronDown, FiMenu } from 'react-icons/fi'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import { lsToCart } from '@/redux/features/cartSlice';
import Link from 'next/link';
import { MdLogout } from "react-icons/md";



export default function Header({ user }) {

    const cart = useSelector((store) => store.cart);
    const dispatcher = useDispatch();
    const [open, setOpen] = useState(false)

    useEffect(
        () => {
            dispatcher(lsToCart())
        },
        []
    )

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        window.location.href = "/login"
    }

    return (
        <>
        <header className="w-full bg-white border-b">

            {/*  Top Bar  */}
            <div className="hidden md:block  text-sm px-2">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
                    <div className="flex items-center gap-4">
                        <span className="bg-gray-100 px-6 py-2 rounded-xl text-xs font-medium">
                            Hotline 24/7
                        </span>
                        <span className="font-semibold">(025) 3886 25 16</span>
                    </div>

                    <div className="flex items-center gap-6 font-semibold">
                        <span>Sell on Swoo</span>
                        <span>Order Tracking</span>

                        <div className="flex items-center gap-1 cursor-pointer">
                            USD <FiChevronDown size={14} />
                        </div>

                        <div className="flex items-center gap-1 cursor-pointer">
                            Eng <FiChevronDown size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <header className='sticky top-0 left-0 z-20 bg-white'>
            {/*  Main Header  */}
            <div className="max-w-7xl    mx-auto px-7 py-4 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/">
                    <div className="flex items-center gap-3 cursor-pointer">

                        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                            <Image
                                src="/logo.png"
                                alt="SWOO TECH MART"
                                width={38}
                                height={38}
                                className="object-contain"
                                priority
                            />
                        </div>

                        <div>
                            <h2 className="font-extrabold text-lg leading-5">
                                SWOO
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">
                                TECH MART
                            </p>
                        </div>
                    </div>
                </Link>

                {/* NAVIGATION */}
                <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-700">

                    <Link href="/">
                        <div className="flex items-center gap-1 hover:text-teal-500 transition cursor-pointer">
                            Home <FiChevronDown size={14} />
                        </div>
                    </Link>

                    <div className="flex items-center gap-1 hover:text-teal-500 transition cursor-pointer">
                        Pages <FiChevronDown size={14} />
                    </div>

                    <Link href="/products">
                        <div className="flex items-center gap-1 hover:text-teal-500 transition cursor-pointer">
                            Products <FiChevronDown size={14} />
                        </div>
                    </Link>

                    <Link href="/contact">
                        <span className="hover:text-teal-500 transition cursor-pointer">
                            Contact
                        </span>
                    </Link>
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* USER */}
                    <div className="hidden md:block relative">

                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Welcome
                        </p>

                        <div className="font-semibold text-sm">

                            {user ? (
                                <div>

                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="flex items-center gap-1 hover:text-teal-500 transition cursor-pointer"
                                    >
                                        {user.name}
                                        <FiChevronDown size={14} />
                                    </button>

                                    {open && (
                                        <div className="absolute right-0 mt-3 w-40 bg-white border rounded-xl shadow-lg overflow-hidden z-50">

                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-3 text-sm flex items-center justify-between hover:bg-red-50 transition"
                                            >
                                                Logout
                                                <MdLogout />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-sm">
                                    <Link
                                        href="/login"
                                        className="hover:text-teal-500 transition"
                                    >
                                        Login
                                    </Link>

                                    <span>/</span>

                                    <Link
                                        href="/register"
                                        className="hover:text-teal-500 transition"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cart */}
                    <Link href="/cart">
                        <div className="flex items-center gap-3 cursor-pointer group">

                            <div className="relative">

                                <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center transition">

                                    <FiShoppingCart
                                        size={22}
                                        className=" hover:text-teal-500 transition"
                                    />
                                </div>

                                <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                                    {cart?.items?.length || 0}
                                </span>
                            </div>

                            <div className="hidden md:block">
                                <p className="text-xs text-gray-400 uppercase">
                                    Cart
                                </p>

                                <span className="font-semibold text-sm text-gray-700">
                                    {cart?.final_total || "$0.00"}
                                </span>
                            </div>
                        </div>
                    </Link>


                    {/* Mobile Menu */}
                    <button className="lg:hidden">
                        <FiMenu size={22} />
                    </button>
                </div>
            </div>

            {/*  Search Bar  */}
            <div className="bg-teal-500">
                <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

                    {/* Search Bar */}
                    <div className="w-full lg:w-[55%] bg-white rounded-full overflow-hidden flex items-center">

                        {/* Category Button */}
                        <button className="px-4 sm:px-5 py-3 text-sm font-medium flex items-center gap-1 whitespace-nowrap border-r">
                            All Categories
                            <FiChevronDown size={14} />
                        </button>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="flex-1 px-4 py-3 outline-none text-sm min-w-0"
                        />

                        {/* Search Button */}
                        <button className="px-4 sm:px-5 text-gray-600">
                            <FiSearch size={20} />
                        </button>
                    </div>

                    {/* Info Bar */}
                    <div className="hidden md:flex flex-wrap items-center justify-center gap-4 lg:gap-8 text-white text-xs sm:text-sm font-medium text-center">
                        <span>FREE SHIPPING OVER $199</span>
                        <span>30 DAYS MONEY BACK</span>
                        <span>100% SECURE PAYMENT</span>
                    </div>

                </div>
            </div>
        </header>

</>
        
    )
}
