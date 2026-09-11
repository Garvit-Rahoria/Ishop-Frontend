"use client";

import React from "react";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { CgFileDocument } from "react-icons/cg";
import { FaProductHunt } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { SiBrandfetch } from "react-icons/si";
import { FiMail, FiX } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Sidebar({ mobileOpen = false, onClose }) {
  const pathname = usePathname();

  const items = [
    { name: "Dashboard", icon: <TbLayoutDashboardFilled className="text-xl" />, path: "/admin" },
    { name: "Category", icon: <CgFileDocument className="text-xl" />, path: "/admin/category" },
    { name: "Brand", icon: <SiBrandfetch className="text-xl" />, path: "/admin/brand" },
    { name: "Color", icon: <IoIosColorPalette className="text-xl" />, path: "/admin/color" },
    { name: "Product", icon: <FaProductHunt className="text-xl" />, path: "/admin/product" },
    { name: "Order", icon: <MdBorderColor className="text-xl" />, path: "/admin/order" },
    { name: "Messages", icon: <FiMail className="text-xl" />, path: "/admin/messages" },
  ];

  const nav = (showClose) => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center shrink-0 pb-4 border-b border-teal-200/80">
        <Logo open={true} />
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-teal-800 hover:bg-teal-200"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        ) : null}
      </div>

      <nav className="mt-5 space-y-1.5 overflow-hidden">
        {items.map((item, index) => {
          const active =
            item.path === "/admin"
              ? pathname === "/admin"
              : pathname === item.path || pathname.startsWith(item.path + "/");

          return (
            <Link
              key={index}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors duration-150
              ${
                active
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-teal-900/80 hover:bg-teal-200 hover:text-teal-950"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop — fixed, no scroll */}
      <aside className="hidden lg:flex w-64 fixed inset-y-0 left-0 z-40 flex-col bg-teal-100 border-r border-teal-200 p-4 overflow-hidden">
        {nav(false)}
      </aside>

      {/* Spacer so main content isn't under fixed sidebar */}
      <div className="hidden lg:block w-64 shrink-0" aria-hidden />

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close sidebar backdrop"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-teal-100 shadow-xl p-4 flex flex-col overflow-hidden">
            {nav(true)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
