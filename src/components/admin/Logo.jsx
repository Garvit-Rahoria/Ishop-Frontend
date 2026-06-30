import { FaShoppingBag } from "react-icons/fa";

export default function Logo({ open }) {
  return (
    <div className="flex items-center gap-2">
      {/* Icon */}
      <div className="bg-blue-950 text-white p-2 rounded-lg">
        <FaShoppingBag className="text-lg" />
      </div>

      {/* Text */}
      {open && (
        <div className="leading-tight">
          <h1 className="text-xl font-bold text-blue-950">Ishop</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      )}
    </div>
  );
}