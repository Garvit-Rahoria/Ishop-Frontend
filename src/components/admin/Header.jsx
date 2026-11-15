"use client";

import React from "react";
import { LogOut, Menu, ExternalLink, ShieldCheck } from "lucide-react";
import { client } from "@/utils/helper";
import { clearAuthCookie } from "@/utils/authCookie";
import Swal from "sweetalert2";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ onMenuClick, onLoggedOut }) {
  const pathname = usePathname();

  // Generate dynamic page title based on route
  const getPageTitle = () => {
    if (pathname === "/admin") return { title: "Dashboard", category: "Overview" };
    if (pathname.startsWith("/admin/product")) return { title: "Products", category: "Catalog" };
    if (pathname.startsWith("/admin/category")) return { title: "Categories", category: "Catalog" };
    if (pathname.startsWith("/admin/brand")) return { title: "Brands", category: "Catalog" };
    if (pathname.startsWith("/admin/color")) return { title: "Colors", category: "Catalog" };
    if (pathname.startsWith("/admin/order")) return { title: "Orders", category: "Operations" };
    if (pathname.startsWith("/admin/messages")) return { title: "Messages", category: "Operations" };
    return { title: "Admin Panel", category: "Portal" };
  };

  const { title, category } = getPageTitle();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Log out of Admin?",
      text: "You will be redirected back to the login screen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f766e",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("jwt");
    onLoggedOut?.();

    void Promise.allSettled([
      client.post("/user/logout"),
      clearAuthCookie(),
    ]);
  };

  return (
    <header className="w-full h-16 md:h-[70px] bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
        ) : null}

        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400 font-medium hidden sm:inline">{category}</span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <h1 className="font-bold text-slate-900 text-base md:text-lg tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Status, Store Link & Logout */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Live Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Online</span>
        </div>

        {/* View Store button */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 transition"
          title="Open customer storefront in a new tab"
        >
          <span>Storefront</span>
          <ExternalLink size={13} />
        </Link>

        {/* Admin Role Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-xl font-medium">
          <ShieldCheck size={14} className="text-teal-600" />
          <span>Super Admin</span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs md:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl border border-transparent hover:border-rose-100 transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
