"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCategories,
  getBrands,
  getColors,
  getProductById,
} from "@/api/api-call";
import Select from "react-select";
import { notify, client } from "@/utils/helper";
import { Editor } from "primereact/editor";
import { resolveMediaUrl } from "@/utils/media";
import { ArrowLeft, UploadCloud, Loader2, IndianRupee } from "lucide-react";

export default function EditProduct({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const [selColor, setSelColor] = useState([]);
  const [selCategory, setSelCategory] = useState(null);
  const [selBrand, setSelBrand] = useState(null);
  const [shortDesc, setShortDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const nameRef = useRef();
  const slugRef = useRef();
  const fileRef = useRef();
  const orginal_price = useRef();
  const discount_percent = useRef();
  const final_price = useRef();

  function colorSelect(selected) {
    setSelColor(selected || []);
  }

  const getData = async () => {
    setFetchLoading(true);
    try {
      const [catRes, brandRes, colorRes, prodRes] = await Promise.all([
        getCategories(),
        getBrands(),
        getColors(),
        getProductById(id),
      ]);

      const catOpts = (catRes?.data || []).map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      const brandOpts = (brandRes?.data || []).map((b) => ({
        label: b.name,
        value: b._id,
      }));
      const colorOpts = (colorRes?.data || []).map((c) => ({
        label: c.name,
        value: c._id,
      }));

      setCategories(catOpts);
      setBrands(brandOpts);
      setColors(colorOpts);

      const prod = prodRes?.data || {};

      if (nameRef.current) nameRef.current.value = prod.name || "";
      if (slugRef.current) slugRef.current.value = prod.slug || "";
      if (orginal_price.current) orginal_price.current.value = prod.orginal_price || "";
      if (discount_percent.current) discount_percent.current.value = prod.discount_percent ?? prod.discount_percentage ?? 0;
      if (final_price.current) final_price.current.value = prod.final_price || "";

      setShortDesc(prod.short_description || "");
      setText(prod.long_description || "");

      setImage(resolveMediaUrl(prodRes?.meta?.imageBaseUrl, prod.thumbnail) || "");

      if (prod.categoryId) {
        const catId = prod.categoryId._id || prod.categoryId;
        const matched = catOpts.find((c) => c.value === catId);
        if (matched) setSelCategory(matched);
      }

      if (prod.brandId) {
        const bId = prod.brandId._id || prod.brandId;
        const matched = brandOpts.find((b) => b.value === bId);
        if (matched) setSelBrand(matched);
      }

      if (Array.isArray(prod.colorId)) {
        const matchedColors = prod.colorId
          .map((c) => {
            const cId = c._id || c;
            return colorOpts.find((opt) => opt.value === cId);
          })
          .filter(Boolean);
        setSelColor(matchedColors);
      }
    } catch (err) {
      console.error(err);
      notify("Failed to load product data", false);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) getData();
  }, [id]);

  function createSlug() {
    const catSlug = nameRef.current.value;
    const slug = catSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    slugRef.current.value = slug;
  }

  function calculatePrice(type) {
    const op = Number(orginal_price.current.value);
    const dp = Number(discount_percent.current.value);
    const fp = Number(final_price.current.value);

    if (type === "discount") {
      if (op <= 0 || isNaN(op)) {
        notify("First enter original price", false);
        discount_percent.current.value = "";
        return;
      }
      if (dp < 0 || dp > 100) {
        notify("Discount percent must be between 0 and 100", false);
        return;
      }
      const final = Math.floor(op - (op * dp) / 100);
      final_price.current.value = final;
    }

    if (type === "final") {
      if (op <= 0 || isNaN(op)) {
        notify("First enter original price", false);
        final_price.current.value = "";
        return;
      }
      if (fp > op) {
        notify("Final price cannot exceed original price", false);
        return;
      }
      const discount = Math.floor(((op - fp) / op) * 100);
      discount_percent.current.value = discount;
    }

    if (type === "original") {
      if (dp > 0) {
        const final = Math.floor(op - (op * dp) / 100);
        final_price.current.value = final;
      } else if (fp > 0) {
        const discount = Math.floor(((op - fp) / op) * 100);
        discount_percent.current.value = discount;
      }
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("slug", slugRef.current.value);
    formData.append("orginal_price", orginal_price.current.value);
    formData.append("discount_percent", discount_percent.current.value || 0);
    formData.append("final_price", final_price.current.value);
    formData.append(
      "colorId",
      JSON.stringify(selColor.map((c) => c.value))
    );

    if (selCategory?.value) {
      formData.append("categoryId", selCategory.value);
    }
    if (selBrand?.value) {
      formData.append("brandId", selBrand.value);
    }

    formData.append("short_description", shortDesc);
    formData.append("long_description", text);

    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append("thumbnail", file);
    }

    setLoading(true);

    client
      .put(`/product/edit/${id}`, formData)
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.push("/admin/product");
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Failed to update product";
        notify(message, false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (fetchLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={32} className="animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/admin/product"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Update product catalog specifications, pricing tiers, and linked variants.
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            1. Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                ref={nameRef}
                onChange={createSlug}
                required
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 text-xs font-mono text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                  /product/
                </span>
                <input
                  type="text"
                  ref={slugRef}
                  readOnly
                  className="w-full px-4 py-2.5 text-xs font-mono bg-slate-100 border border-slate-200 rounded-r-xl text-slate-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Short Description / Summary
            </label>
            <textarea
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Detailed Product Description
            </label>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <Editor
                value={text}
                onTextChange={(e) => setText(e.htmlValue)}
                style={{ height: "240px" }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <IndianRupee size={15} />
            <span>2. Pricing & Financials</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Original MRP (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                ref={orginal_price}
                onChange={() => calculatePrice("original")}
                required
                min="1"
                className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                ref={discount_percent}
                onChange={() => calculatePrice("discount")}
                min="0"
                max="100"
                className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                ref={final_price}
                onChange={() => calculatePrice("final")}
                required
                className="w-full px-4 py-2.5 text-sm font-extrabold bg-teal-50/50 text-teal-800 border border-teal-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Taxonomy & Variants */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            3. Organization & Variations
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Category
              </label>
              <Select
                value={selCategory}
                onChange={setSelCategory}
                options={categories}
                placeholder="Select category..."
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    borderColor: "#e2e8f0",
                    backgroundColor: "#f8fafc",
                    padding: "2px",
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Brand
              </label>
              <Select
                value={selBrand}
                onChange={setSelBrand}
                options={brands}
                placeholder="Select brand..."
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    borderColor: "#e2e8f0",
                    backgroundColor: "#f8fafc",
                    padding: "2px",
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Colors Available
              </label>
              <Select
                isMulti
                value={selColor}
                options={colors}
                onChange={colorSelect}
                closeMenuOnSelect={false}
                placeholder="Select colors..."
                className="text-sm"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    borderColor: "#e2e8f0",
                    backgroundColor: "#f8fafc",
                    padding: "2px",
                  }),
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Media */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            4. Media & Thumbnail
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Primary Product Thumbnail
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/20"
            >
              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-32 h-32 object-contain rounded-xl border border-slate-200 bg-white p-2 mb-2 shadow-2xs"
                  />
                  <p className="text-xs font-semibold text-teal-600">
                    Click to replace current thumbnail
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={36} className="text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Click or drag primary product photo to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Square 1:1 image recommended (PNG, JPG, WEBP)
                  </p>
                </div>
              )}

              <input
                type="file"
                name="thumbnail"
                ref={fileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImage(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/admin/product">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition"
            >
              Cancel
            </button>
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition disabled:opacity-60 cursor-pointer"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            <span>{loading ? "Saving Changes..." : "Update Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
