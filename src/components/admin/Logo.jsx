import { FaShoppingBag } from "react-icons/fa";

export default function Logo({ open }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="bg-teal-700 text-white p-2 rounded-lg shrink-0 shadow-sm">
        <FaShoppingBag className="text-lg" />
      </div>

      {open ? (
        <div className="leading-tight min-w-0">
          <h1 className="text-base font-bold text-teal-950 truncate">Swoo</h1>
          <p className="text-[11px] text-teal-800/70">Admin Panel</p>
        </div>
      ) : null}
    </div>
  );
}
