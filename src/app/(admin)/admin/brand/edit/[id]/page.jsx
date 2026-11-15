"use client";

import { use, useEffect, useRef, useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react";
import { getBrandById } from "@/api/api-call";
import { resolveMediaUrl } from "@/utils/media";

export default function EditBrand({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const nameRef = useRef();
  const slugRef = useRef();
  const fileRef = useRef();

  function createSlug() {
    const brandName = nameRef.current.value;
    const slug = brandName
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

  useEffect(() => {
    async function loadData() {
      setFetchLoading(true);
      try {
        const brandRes = await getBrandById(id);
        const bData = brandRes?.data || {};
        setBrand(bData);
        setImagePreview(resolveMediaUrl(brandRes?.meta?.imageBaseUrl, bData?.image) || "");
      } catch (err) {
        console.error(err);
        notify("Failed to load brand data", false);
      } finally {
        setFetchLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("slug", slugRef.current.value);

    const file = fileRef.current?.files?.[0];
    if (file) {
      formData.append("image", file);
    }

    setLoading(true);

    client
      .put(`/brand/update/${id}`, formData)
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.push("/admin/brand");
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Failed to update brand";
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
        <p className="text-sm font-semibold">Loading brand details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/brand"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Brands</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Brand
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify brand name, slug, linked category, or replacement logo.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs">
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Brand Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={nameRef}
              defaultValue={brand?.name}
              onChange={createSlug}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              URL Slug
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 text-xs font-mono text-slate-400 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                /brand/
              </span>
              <input
                type="text"
                ref={slugRef}
                defaultValue={brand?.slug}
                readOnly
                className="w-full px-4 py-2.5 text-xs font-mono bg-slate-100 border border-slate-200 rounded-r-xl text-slate-600"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Brand Logo
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
                    className="w-28 h-16 object-contain rounded-xl border border-slate-200 bg-white p-2 mb-2 shadow-2xs"
                  />
                  <p className="text-xs font-semibold text-teal-600">
                    Click to replace current logo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={32} className="text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">
                    Click or drag logo to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    SVG, PNG, or JPG recommended with transparent background
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

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link href="/admin/brand">
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
              <span>{loading ? "Saving Changes..." : "Update Brand"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
