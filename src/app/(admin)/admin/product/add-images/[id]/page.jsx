"use client";

import { use, useEffect, useRef, useState } from "react";
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Loader2, X, Images } from "lucide-react";
import { getProductById } from "@/api/api-call";
import { resolveMediaUrl } from "@/utils/media";

export default function AddProductImages({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [baseUrl, setBaseUrl] = useState("");

  const fileRef = useRef();

  async function getProduct() {
    setFetchLoading(true);
    try {
      const { data, meta } = await getProductById(id);
      setProduct(data || {});
      setImages(data?.image || data?.images || []);
      setBaseUrl(meta?.imageBaseUrl || "");
    } catch (error) {
      console.error(error);
      notify("Failed to load product details", false);
    } finally {
      setFetchLoading(false);
    }
  }

  useEffect(() => {
    if (id) getProduct();
  }, [id]);

  const submitHandler = (event) => {
    event.preventDefault();

    const files = fileRef.current?.files;
    if (!files || files.length === 0) {
      notify("Please select at least one gallery image", false);
      return;
    }

    const formData = new FormData();
    for (let img of files) {
      if (img) formData.append("images", img);
    }

    setLoading(true);

    client
      .post(`/product/add-images/${id}`, formData)
      .then((response) => {
        notify(response.data.message, response.data.success);
        if (response.data.success) {
          router.push("/admin/product");
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || "Failed to upload images";
        notify(message, false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const removeImage = (img, index) => {
    if (typeof img === "string") {
      client
        .put(`/product/remove_image/${id}`, { image_url: img })
        .then((response) => {
          notify(response.data.message, response.data.success);
          if (response.data.success) {
            setImages((prev) => prev.filter((i) => i !== img));
          }
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message || "Failed to remove image";
          notify(message, false);
        });
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  if (fetchLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={32} className="animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-semibold">Loading product gallery...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
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
          Product Gallery Images
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage extra photos and angle shots for{" "}
          <strong className="text-slate-800">{product?.name || "Product"}</strong>.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
        {/* Existing Images Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Gallery ({images.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Hover over image and click &times; to remove
            </span>
          </div>

          {images.length === 0 ? (
            <div className="py-10 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
              <Images size={28} className="mx-auto mb-2 text-slate-300" />
              <p>No extra gallery images uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, index) => {
                const isString = typeof img === "string";
                const src = isString
                  ? resolveMediaUrl(baseUrl, img)
                  : img.preview;

                return (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-2xl border border-slate-200 bg-slate-50/50 p-2 overflow-hidden flex items-center justify-center shadow-2xs"
                  >
                    <img
                      src={src}
                      alt={`Gallery ${index}`}
                      className="max-h-full max-w-full object-contain"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(img, index)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Delete this image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upload New Section */}
        <form onSubmit={submitHandler} className="space-y-5 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Upload Additional Photos (Select Multiple)
            </label>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50/50 hover:bg-teal-50/20"
            >
              <UploadCloud size={36} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Click to browse multiple photos
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hold Ctrl (or Cmd) to select multiple images (PNG, JPG, WEBP)
              </p>

              <input
                type="file"
                multiple
                ref={fileRef}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
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
              <span>{loading ? "Uploading..." : "Save Gallery"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
