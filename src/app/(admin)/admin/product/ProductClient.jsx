"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Images,
  Package,
  Layers,
  Sparkles,
  ArrowUpDown,
  X,
} from "lucide-react";
import StatusBtn from "@/components/admin/StatusBtn";
import DeleteBtn from "@/components/admin/DeleteBtn";
import ViewBtn from "@/components/admin/ViewBtn";
import { resolveMediaUrl } from "@/utils/media";
import { formatCurrency } from "@/utils/adminFormatters";

export default function ProductClient({ initialProducts = [], meta = {} }) {
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all | in_stock | out_of_stock
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  // Filter products based on search term & filter dropdowns
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((prod) => {
      // Search match
      const q = search.toLowerCase().trim();
      const nameMatch = prod.name?.toLowerCase().includes(q);
      const catMatch = prod.categoryId?.name?.toLowerCase().includes(q);
      const brandMatch = prod.brandId?.name?.toLowerCase().includes(q);
      const matchesSearch = !q || nameMatch || catMatch || brandMatch;

      // Stock filter
      let matchesStock = true;
      if (stockFilter === "in_stock") matchesStock = Boolean(prod.stock);
      if (stockFilter === "out_of_stock") matchesStock = !Boolean(prod.stock);

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = Boolean(prod.status);
      if (statusFilter === "inactive") matchesStatus = !Boolean(prod.status);

      return matchesSearch && matchesStock && matchesStatus;
    });
  }, [initialProducts, search, stockFilter, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setStockFilter("all");
    setStatusFilter("all");
  };

  const isFiltered = search || stockFilter !== "all" || statusFilter !== "all";

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Products Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {initialProducts.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store's inventory, pricing, variants, and visibility.
          </p>
        </div>

        <Link href="/admin/product/create">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition cursor-pointer text-sm"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </Link>
      </div>

      {/* Filter / Search Bar Card */}
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
            placeholder="Search by product, category, or brand..."
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Visibility</option>
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

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-16">Item</th>
                <th className="py-3.5 px-4 min-w-[220px]">Product Details</th>
                <th className="py-3.5 px-4">Category & Brand</th>
                <th className="py-3.5 px-4">Price / Discount</th>
                <th className="py-3.5 px-4">Colors</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Top Selling</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <Package size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600 text-sm">
                      No products found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {isFiltered
                        ? "Try adjusting your search or filters."
                        : "Click 'Add New Product' to list your first item."}
                    </p>
                    {isFiltered && (
                      <button
                        onClick={clearFilters}
                        className="mt-3 text-xs font-semibold text-teal-600 hover:underline"
                      >
                        Clear search filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const discount =
                    prod.discount_percent ?? prod.discount_percentage ?? 0;
                  const colors = Array.isArray(prod.colorId) ? prod.colorId : [];

                  return (
                    <tr
                      key={prod._id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={
                              resolveMediaUrl(meta?.imageBaseUrl, prod.thumbnail) ||
                              "/placeholder.svg"
                            }
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>

                      {/* Product Name & SKU / Slug */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 line-clamp-1 hover:text-teal-600 transition-colors">
                          {prod.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-[200px]">
                          /{prod.slug || String(prod._id).slice(-6)}
                        </p>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-slate-700 truncate">
                            {prod.categoryId?.name || (
                              <span className="text-slate-400 font-normal">
                                Uncategorized
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">
                            {prod.brandId?.name || "No Brand"}
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900">
                            {formatCurrency(prod.final_price)}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {prod.orginal_price && prod.orginal_price > prod.final_price && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatCurrency(prod.orginal_price)}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                -{discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Colors */}
                      <td className="py-3.5 px-4">
                        {colors.length === 0 ? (
                          <span className="text-xs text-slate-400">None</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            {colors.slice(0, 3).map((col, idx) => (
                              <span
                                key={idx}
                                className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                                style={{
                                  backgroundColor: col.color_code || "#fff",
                                }}
                                title={col.name}
                              />
                            ))}
                            {colors.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                +{colors.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBtn
                          value={prod.status}
                          url={`/product/status-update/${prod._id}`}
                          field="status"
                        />
                      </td>

                      {/* Top Selling Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBtn
                          value={prod.top_selling ?? prod.is_top}
                          url={`/product/status-update/${prod._id}`}
                          field="top_selling"
                        />
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBtn
                          value={prod.stock}
                          url={`/product/status-update/${prod._id}`}
                          field="stock"
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Quick View Modal */}
                          <ViewBtn prod={prod} />

                          {/* Edit Details */}
                          <Link href={`/admin/product/edit/${prod._id}`}>
                            <button
                              type="button"
                              className="p-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 transition cursor-pointer"
                              title="Edit product"
                            >
                              <Edit3 size={15} />
                            </button>
                          </Link>

                          {/* Additional Images */}
                          <Link href={`/admin/product/add-images/${prod._id}`}>
                            <button
                              type="button"
                              className="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition cursor-pointer"
                              title="Manage gallery images"
                            >
                              <Images size={15} />
                            </button>
                          </Link>

                          {/* Delete */}
                          <DeleteBtn API={`/product/delete/${prod._id}`} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filteredProducts.length}</strong> of{" "}
            {initialProducts.length} products
          </span>
          <span className="font-medium">Swoo Techmart Catalog</span>
        </div>
      </div>
    </div>
  );
}

