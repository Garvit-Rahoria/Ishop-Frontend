"use client";

import React from "react";
import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-[70px] bg-gray-200 text-gray-800 flex items-center justify-between px-6 sticky top-0 z-50 border-b shadow-sm">
      
     

      {/* Center - Search */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-[300px]">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 w-full text-sm placeholder-gray-400"
        />
      </div>

      {/* Right - Icons & Profile */}
      <div className="flex items-center gap-5">
        
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-9 h-9 rounded-full"
          />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
        </div>

      </div>
    </header>
  );
}