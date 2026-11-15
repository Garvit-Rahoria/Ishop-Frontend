"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Palette, Copy, Check, X } from "lucide-react";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";
import { notify } from "@/utils/helper";

export default function ColorClient({ initialColors = [] }) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filteredColors = useMemo(() => {
    return initialColors.filter((col) => {
      const q = search.toLowerCase().trim();
      return (
        !q ||
        col.name?.toLowerCase().includes(q) ||
        col.slug?.toLowerCase().includes(q) ||
        col.color_code?.toLowerCase().includes(q)
      );
    });
  }, [initialColors, search]);

  const copyHex = (code, id) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    notify(`Copied ${code} to clipboard!`, true);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Color Palette
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {initialColors.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage product variant color shades, HEX codes, and display badges.
          </p>
        </div>

        <Link href="/admin/color/create">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>Add New Color</span>
          </button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by color name, hex code (#ffffff), or slug..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-28">Swatch</th>
                <th className="py-3.5 px-4">Color Name</th>
                <th className="py-3.5 px-4">HEX Code</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredColors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400">
                    <Palette size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No colors found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search
                        ? "No colors match your search query."
                        : "Click 'Add New Color' to add your first shade."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredColors.map((col) => (
                  <tr
                    key={col._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Swatch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ background: col.color_code || "#ffffff" }}
                          className="w-8 h-8 rounded-full border border-slate-300 shadow-sm ring-2 ring-slate-100 shrink-0"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{col.name}</p>
                    </td>

                    {/* HEX Code */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => copyHex(col.color_code, col._id)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                        title="Click to copy HEX code"
                      >
                        <span>{col.color_code || "#—"}</span>
                        {copiedId === col._id ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy size={12} className="text-slate-400" />
                        )}
                      </button>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-slate-500">
                        /{col.slug}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBtn
                        value={col.status}
                        url={`/color/status-update/${col._id}`}
                        field="status"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/admin/color/edit/${col._id}`}>
                          <button
                            type="button"
                            className="p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 transition cursor-pointer"
                            title="Edit color"
                          >
                            <Edit3 size={15} />
                          </button>
                        </Link>

                        <DeleteBtn API={`/color/delete/${col._id}`} id={col._id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filteredColors.length}</strong> of{" "}
            {initialColors.length} colors
          </span>
          <span className="font-medium">Color Swatches</span>
        </div>
      </div>
    </div>
  );
}

