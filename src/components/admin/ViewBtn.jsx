"use client";

import React, { useState } from "react";
import { Eye, X, ExternalLink, Edit3, CheckCircle2, XCircle } from "lucide-react";
import { resolveMediaUrl } from "@/utils/media";
import { formatCurrency } from "@/utils/adminFormatters";

export default function ViewBtn({ prod }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 transition cursor-pointer hover:shadow-2xs"
        title="Quick view product details"
        aria-label="View product"
      >
        <Eye size={15} />
      </button>

      {open && <ProductModal prod={prod} onClose={() => setOpen(false)} />}
    </>
  );
}

function ProductModal({ prod, onClose }) {
  const [activeImage, setActiveImage] = useState(
    resolveMediaUrl("", prod.thumbnail) || "/placeholder.svg"
  );

  const discount = prod.discount_percent ?? prod.discount_percentage ?? 0;
  const inStock = Boolean(prod.stock);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Product Overview
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-mono text-slate-500">
              #{String(prod._id || "").slice(-8)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Images */}
            <div className="space-y-4">
              <div className="aspect-square w-full rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden p-3 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                />
              </div>

              {/* Gallery Thumbnails */}
              {Array.isArray(prod.image) && prod.image.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(resolveMediaUrl("", prod.thumbnail))
                    }
                    className="w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 border-teal-500 p-1 bg-white"
                  >
                    <img
                      src={resolveMediaUrl("", prod.thumbnail)}
                      alt="Thumbnail"
                      className="w-full h-full object-contain"
                    />
                  </button>
                  {prod.image.map((img, idx) => {
                    const src = resolveMediaUrl(
                      process.env.NEXT_PUBLIC_PRODUCT_IMAGE,
                      img
                    );
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImage(src)}
                        className="w-16 h-16 rounded-xl border-2 border-slate-200 hover:border-teal-400 overflow-hidden shrink-0 p-1 bg-white transition"
                      >
                        <img
                          src={src}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {prod.categoryId?.name && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80">
                      {prod.categoryId.name}
                    </span>
                  )}
                  {prod.brandId?.name && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {prod.brandId.name}
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                  {prod.name}
                </h2>

                {prod.short_description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {prod.short_description}
                  </p>
                )}
              </div>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-3xl font-extrabold text-teal-700">
                  {formatCurrency(prod.final_price)}
                </span>
                {prod.orginal_price && prod.orginal_price > prod.final_price && (
                  <span className="text-base text-slate-400 line-through">
                    {formatCurrency(prod.orginal_price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Stock & Availability */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>In Stock & Ready to Sell</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle size={14} className="text-rose-500" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Available Colors */}
              {Array.isArray(prod.colorId) && prod.colorId.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Available Colors ({prod.colorId.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {prod.colorId.map((color, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                          style={{ backgroundColor: color.color_code || "#fff" }}
                        />
                        <span className="text-xs font-semibold text-slate-700">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Description snippet */}
              {prod.long_description && (
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </h4>
                  <div
                    className="text-xs text-slate-600 prose prose-sm max-w-none max-h-32 overflow-y-auto leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: prod.long_description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {prod.slug && (
            <a
              href={`/product/${prod.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
            >
              <span>View in Store</span>
              <ExternalLink size={13} />
            </a>
          )}
          <a
            href={`/admin/product/edit/${prod._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm shadow-teal-600/20"
          >
            <Edit3 size={13} />
            <span>Edit Product</span>
          </a>
        </div>
      </div>
    </div>
  );
}
