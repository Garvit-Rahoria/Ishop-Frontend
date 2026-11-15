import React from "react";
import { Sparkles } from "lucide-react";

export default function Logo({ open = true }) {
  return (
    <div className="flex items-center gap-3 min-w-0 select-none">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white font-black text-xl shadow-lg shadow-teal-500/20 shrink-0">
        S
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
      </div>

      {open ? (
        <div className="leading-tight min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-white tracking-tight">Swoo</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
            Store Management
          </p>
        </div>
      ) : null}
    </div>
  );
}
