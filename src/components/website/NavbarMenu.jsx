"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function NavMenu({ mobile = false, onItemClick }) {
  return (
    <div
      className={
        mobile
          ? "flex flex-col gap-4"
          : "hidden lg:flex items-center gap-8 font-medium"
      }
    >
      <Link href="/" onClick={onItemClick}>
        <span className="flex items-center gap-1">
          Home {!mobile && <ChevronDown size={14} />}
        </span>
      </Link>

      <Link href="/page" onClick={onItemClick}>
        <span className="flex items-center gap-1">
          Page {!mobile && <ChevronDown size={14} />}
        </span>
      </Link>

      <Link href="/Store" onClick={onItemClick}>
        <span className="flex items-center gap-1">
          Products {!mobile && <ChevronDown size={14} />}
        </span>
      </Link>

      <Link href="/contact" onClick={onItemClick}>
        <span className="flex items-center gap-1">
          Contact {!mobile && <ChevronDown size={14} />}
        </span>
      </Link>
    </div>
  );
}