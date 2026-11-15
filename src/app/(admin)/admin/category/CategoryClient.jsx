"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Layers, X } from "lucide-react";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";
import { resolveMediaUrl } from "@/utils/media";

export default function CategoryClient({ initialCategories = [], meta = {} }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCategories = useMemo(() => {
    return initialCategories.filter((cat) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cat.name?.toLowerCase().includes(q) ||
        cat.slug?.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = Boolean(cat.status);
      if (statusFilter === "inactive") matchesStatus = !Boolean(cat.status);

      return matchesSearch && matchesStatus;
    });
  }, [initialCategories, search, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const isFiltered = search || statusFilter !== "all";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Category Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {initialCategories.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Organize products into store departments and navigation menus.
          </p>
        </div>

        <Link href="/admin/category/create">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>Add New Category</span>
          </button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category by name or slug..."
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

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-16">Icon</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Homepage</th>
                <th className="py-3.5 px-4 text-center">Top Category</th>
                <th className="py-3.5 px-4 text-center">Popular</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400">
                    <Layers size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No categories found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isFiltered
                        ? "No categories match your search filters."
                        : "Click 'Add New Category' to create your first category."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Image */}
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={
                            resolveMediaUrl(meta?.imageBaseUrl, cat.image) ||
                            "/placeholder.svg"
                          }
                          alt={cat.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{cat.name}</p>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">
                        /{cat.slug}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBtn
                        value={cat.status}
                        url={`/category/status-update/${cat._id}`}
                        field="status"
                      />
                    </td>

                    {/* Home */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBtn
                        value={cat.is_home}
                        url={`/category/status-update/${cat._id}`}
                        field="is_home"
                      />
                    </td>

                    {/* Top */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBtn
                        value={cat.is_top}
                        url={`/category/status-update/${cat._id}`}
                        field="is_top"
                      />
                    </td>

                    {/* Popular */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBtn
                        value={cat.is_popular}
                        url={`/category/status-update/${cat._id}`}
                        field="is_popular"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link href={`/admin/category/edit/${cat._id}`}>
                          <button
                            type="button"
                            className="p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 transition cursor-pointer"
                            title="Edit category"
                          >
                            <Edit3 size={15} />
                          </button>
                        </Link>

                        <DeleteBtn API={`/category/delete/${cat._id}`} />
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
            Showing <strong className="text-slate-700">{filteredCategories.length}</strong> of{" "}
            {initialCategories.length} categories
          </span>
          <span className="font-medium">Store Hierarchy</span>
        </div>
      </div>
    </div>
  );
}

