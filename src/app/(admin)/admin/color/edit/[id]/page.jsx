"use client";

import { useRef, useState, useEffect, use } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getColorsById } from "@/api/api-call";

export default function EditColor({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [color, setColor] = useState(null);
  const [colorCode, setColorCode] = useState("#000000");

  const nameRef = useRef();
  const slugRef = useRef();

  function createSlug() {
    const colorName = nameRef.current.value;
    const slug = colorName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    slugRef.current.value = slug;
  }

  async function getColor() {
    setFetchLoading(true);
    try {
      const res = await getColorsById(id);
      const data = res.data;
      setColor(data);
      setColorCode(data.color_code || "#000000");
    } catch (error) {
      console.error(error);
      notify("Failed to load color details", false);
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    if (id) getColor();
  }, [id]);

  const submitHandler = (event) => {
    event.preventDefault();

    setLoading(true);

    client
      .put(`/color/edit/${id}`, {
        name: nameRef.current.value,
        color_code: colorCode,
        slug: slugRef.current.value,
      })
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.push("/admin/color");
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Failed to update color";
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
        <p className="text-sm font-semibold">Loading color details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/admin/color"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to Colors</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Color
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify the color variant name, HEX code, or URL slug.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs">
        <form className="space-y-6" onSubmit={submitHandler}>
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Color Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              ref={nameRef}
              defaultValue={color?.name}
              onChange={createSlug}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
            />
          </div>

          {/* Color Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Color Code (HEX) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="w-12 h-12 rounded-xl border border-slate-300 cursor-pointer p-1 bg-white"
              />
              <input
                type="text"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
              />
              <span
                style={{ backgroundColor: colorCode }}
                className="w-10 h-10 rounded-full border border-slate-300 shadow-inner"
              />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              ref={slugRef}
              defaultValue={color?.slug}
              readOnly
              className="w-full px-4 py-2.5 text-xs font-mono bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link href="/admin/color">
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
              <span>{loading ? "Saving Changes..." : "Update Color"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
