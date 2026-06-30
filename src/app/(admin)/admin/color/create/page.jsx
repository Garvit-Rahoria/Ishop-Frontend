"use client"

import { useRef, useState } from "react"
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";

export default function AddColor() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const nameRef = useRef();
  const slugRef = useRef();
  // const fileRef = useRef();

  function createSlug() {
    let catSlug = nameRef.current.value;

    let slug = catSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    slugRef.current.value = slug;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = {
      name: nameRef.current.value,
      slug: slugRef.current.value,
      color_code: event.target.color_code.value
    }

    setLoading(true)

    client.post("/color/create", formData).then(
      (response) => {
        notify(response.data.message, response.data.success)

        if (response.data.success) {
          nameRef.current.value = ""
          slugRef.current.value = ""
          // fileRef.current.value = ""
          router.push("/admin/color")
        }
      }
    ).catch(
      (error) => {
        const message =
          error?.response?.data?.message || "Internal Server Error"
        notify(message, false)
      }
    ).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200">

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Color
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a new color for your store
          </p>
        </div>

        <form className="space-y-5" onSubmit={submitHandler}>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
               Name
            </label>
            <input
              type="text"
              ref={nameRef}
              onChange={createSlug}
              placeholder="Color Name"
              className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              ref={slugRef}
              readOnly
              placeholder="Color Slug"
              className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
            />
          </div>

          {/* IMAGE UPLOAD UI */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              HexCode
            </label>

            <div
              className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer hover:border-blue-950 transition"
            >
              <input
              type="color"
              name="color_code"
              className="w-full cursor-pointer"
            />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-950 text-white font-medium hover:shadow-lg"
          >
            {loading ? "waiting..." : "Save"}
          </button>

        </form>

      </div>
    </div>
  )
}