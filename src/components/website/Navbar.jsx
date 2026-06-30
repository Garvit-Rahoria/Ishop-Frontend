"use client";

import { ShoppingCart, Search, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navitems = [
    { name: "Home", path: "/" },
    { name: "Page", path: "/page" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="w-full">

      {/* Top Bar */}
      <div className="bg-gray-100 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">

          <div className="flex items-center gap-3">
            <span className="bg-gray-200 px-3 py-1 rounded-full">
              Hotline 24/7
            </span>
            <span className="font-semibold">(025) 3886 25 16</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Sell on Swoo</span>
            <span>Order Tracking</span>
            <span className="flex items-center gap-1">
              USD <ChevronDown size={14} />
            </span>
          </div>

        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg">
              ✓
            </div>

            <div className="leading-4">
              <p className="font-bold">SWOO</p>
              <p className="text-xs text-gray-500">TECH MART</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 font-medium">
            {navitems.map((item) => (
              <Link key={item.name} href={item.path}>
                <span className="flex items-center gap-1">
                  {item.name} <ChevronDown size={14} />
                </span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5">

            {/* Search icon mobile */}
            <Search className="lg:hidden" size={22} />

            {/* Cart */}
            <div className="flex items-center gap-2 relative">
              <ShoppingCart size={22} />

              <span className="absolute -top-2 -left-2 bg-teal-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                5
              </span>
            </div>

            {/* Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-b">
          <div className="flex flex-col px-4 py-4 gap-4">

            {navitems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}

          </div>
        </div>
      )}

      {/* Search + Features */}
      <div className="bg-teal-600">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 px-4 py-4">

          {/* Search */}
          <div className="flex bg-white rounded-full overflow-hidden w-full lg:w-[420px]">

            <div className="hidden md:flex items-center gap-1 px-4 border-r text-sm">
              <span>All Categories</span>
              <ChevronDown size={14} />
            </div>

            <input
              type="text"
              placeholder="Search anything..."
              className="py-2 px-4 flex-1 outline-none text-sm"
            />

            <button className="px-4">
              <Search size={18} />
            </button>

          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-white text-xs md:text-sm font-medium text-center">
            <span>FREE SHIPPING OVER $199</span>
            <span>30 DAYS MONEY BACK</span>
            <span>100% SECURE PAYMENT</span>
          </div>

        </div>
      </div>

    </div>
  );
}