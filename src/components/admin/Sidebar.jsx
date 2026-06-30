"use client";

import React, { useState } from 'react'
import { CgMenuRightAlt } from "react-icons/cg";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { CgFileDocument } from "react-icons/cg";
import { FaProductHunt } from "react-icons/fa6";
import { MdBorderColor } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { SiBrandfetch } from "react-icons/si";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const items = [
    {
      name: "Dashboard",
      icon: <TbLayoutDashboardFilled className="text-xl" />,
      path: "/admin"
    },
    {
      name: "Category",
      icon: <CgFileDocument className="text-xl" />,
      path: "/admin/category"
    },
    {
      name: "Brand",
      icon: <SiBrandfetch className="text-xl" />,
      path: "/admin/brand"
    },
    {
      name: "Color",
      icon: <IoIosColorPalette className="text-xl" />,
      path: "/admin/color"
    },
    {
      name: "Product",
      icon: <FaProductHunt className="text-xl" />,
      path: "/admin/product"
    },
    {
      name: "Order",
      icon: <MdBorderColor className="text-xl" />,
      path: "/admin/order"
    },

  ];

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} 
      h-screen flex flex-col duration-200 bg-white shadow-xl p-4`}
    >
      {/* Header */}
      <div className='flex justify-between items-center'>
        {open && (
            <div className="flex justify-between items-center">
              <Logo open={open} />
               </div>
        )}

        <CgMenuRightAlt
          onClick={() => setOpen(!open)}
          className={`text-2xl cursor-pointer transition-all ${open ? "" : "mx-auto"
            }`}
        />
      </div>

      {/* Menu */}
      <nav className='flex-1 mt-10 space-y-2'>
        {items.map((item, index) => {
          const active = pathname === item.path;

          return (
            <Link
              key={index}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow transition-all duration-200
              
              ${active
                  ? "bg-blue-950 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-900"
                }

              ${open ? "" : "justify-center"}
              `}
            >
              {item.icon}

              {open && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}