"use client";

import { useRef, useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Layers, Loader2 } from "lucide-react";

export default function AddCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const nameRef = useRef();
  const slugRef = useRef();
  const fileRef = useRef();

  function createSlug() {
    const catName = nameRef.current.value;
    const slug = catName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    slugRef.current.value = slug;
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const file = fileRef.current?.files?.[0];
    if (!file) {
      notify("Please select a category icon or image", false);
      return;
    }

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("slug", slugRef.current.value);
    formData.append("image", file);

    setLoading(true);

    client
      .post("/category/create", formData)
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.push("/admin/category");
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Failed to create category";
        notify(message, false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/category"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Categories</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Category
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a department or product classification to your store navigation.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs">
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={nameRef}
              onChange={createSlug}
              required
              placeholder="e.g. Smart Watches & Wearables"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              URL Slug <span className="text-slate-400 font-normal">(Auto-generated)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 text-xs font-mono text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                /category/
              </span>
              <input
                type="text"
                ref={slugRef}
                readOnly
                placeholder="smart-watches-wearables"
                className="w-full px-4 py-2.5 text-xs font-mono bg-slate-100 border border-slate-200 rounded-r-xl text-slate-600"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Category Icon / Image <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/20"
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-contain rounded-xl border border-slate-200 bg-white p-2 mb-2 shadow-2xs"
                  />
                  <p className="text-xs font-semibold text-teal-600">
                    Click to change selected image
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Click or drag image to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    SVG, PNG, JPG, or WEBP up to 5MB
                  </p>
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link href="/admin/category">
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
              <span>{loading ? "Creating..." : "Save Category"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
