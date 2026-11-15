"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  Palette,
  ShoppingBag,
  Mail,
  Users,
  ExternalLink,
  X,
  ChevronRight,
} from "lucide-react";
import Logo from "./Logo";

export default function Sidebar({ mobileOpen = false, onClose }) {
  const pathname = usePathname();

  const navSections = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          icon: <LayoutDashboard size={18} />,
          path: "/admin",
          badge: null,
        },
      ],
    },
    {
      title: "Catalog",
      items: [
        {
          name: "Products",
          icon: <Package size={18} />,
          path: "/admin/product",
        },
        {
          name: "Categories",
          icon: <Layers size={18} />,
          path: "/admin/category",
        },
        {
          name: "Brands",
          icon: <Sparkles size={18} />,
          path: "/admin/brand",
        },
        {
          name: "Colors",
          icon: <Palette size={18} />,
          path: "/admin/color",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          name: "Orders",
          icon: <ShoppingBag size={18} />,
          path: "/admin/order",
        },
        {
          name: "Users",
          icon: <Users size={18} />,
          path: "/admin/users",
        },
        {
          name: "Messages",
          icon: <Mail size={18} />,
          path: "/admin/messages",
        },
      ],
    },
  ];

  const renderNav = (showClose = false) => (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 shrink-0">
        <Logo open={true} />
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        ) : null}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 space-y-4 dark-scrollbar pr-1">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item, iIdx) => {
                const active =
                  item.path === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.path || pathname.startsWith(item.path + "/");

                return (
                  <Link
                    key={iIdx}
                    href={item.path}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`transition-colors ${
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-teal-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>

                    {active ? (
                      <ChevronRight size={14} className="text-teal-200" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Quick Store Access */}
      <div className="pt-4 border-t border-slate-800 shrink-0 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-teal-400 bg-teal-950/40 border border-teal-500/20 hover:bg-teal-900/40 hover:border-teal-500/40 transition group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Visit Live Store</span>
          </div>
          <ExternalLink size={14} className="group-hover:translate-x-0.5 transition" />
        </Link>

        <div className="flex items-center gap-3 px-2 py-1 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">Swoo Admin</p>
            <p className="text-[10px] text-slate-500 truncate">admin@swoo.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex w-64 fixed inset-y-0 left-0 z-40 flex-col bg-slate-900 border-r border-slate-800/80 p-5 overflow-hidden">
        {renderNav(false)}
      </aside>

      {/* Desktop spacer */}
      <div className="hidden lg:block w-64 shrink-0" aria-hidden />

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 p-5 shadow-2xl flex flex-col z-10 border-r border-slate-800">
            {renderNav(true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
