"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { client } from "@/utils/helper";
import { clearAuthCookie } from "@/utils/authCookie";

export default function Header({ onMenuClick }) {
  const handleLogout = async () => {
    try {
      await client.post("/user/logout");
    } catch (_) {}
    localStorage.removeItem("jwt");
    await clearAuthCookie();
    window.location.href = "/admin";
  };

  return (
    <header className="w-full h-[64px] md:h-[70px] bg-white text-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-5 h-0.5 bg-gray-700" />
          </button>
        ) : null}
        <h1 className="font-semibold text-gray-800 text-sm md:text-base">
          Swoo Admin
        </h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}
