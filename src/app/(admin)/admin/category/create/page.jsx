"use client"

import { useRef, useState } from "react"
import { client, notify } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { FiUploadCloud } from "react-icons/fi";

export default function AddCategory() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState("");
  // const [image, setImage] = useState("")

  const nameRef = useRef();
  const slugRef = useRef();
  const fileRef = useRef();

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

    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("slug", slugRef.current.value);
    // formData.append("image", event.target.image.files[0])
    formData.append("image", fileRef.current.files[0])

    setLoading(true)

    client.post("/category/create", formData).then(
      (response) => {
        notify(response.data.message, response.data.success)

        if (response.data.success) {
          nameRef.current.value = ""
          slugRef.current.value = ""
          fileRef.current.value = ""
          router.push("/admin/category")
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
            Add New Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a new category for your store
          </p>
        </div>

        <form className="space-y-5" onSubmit={submitHandler}>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              ref={nameRef}
              onChange={createSlug}
              placeholder="e.g. Men Clothing"
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
              placeholder="e.g. men-clothing"
              className="w-full px-4 py-2.5 mt-1 rounded-xl border border-gray-300"
            />
          </div>

          {/* IMAGE UPLOAD UI */}
          {/* <div>
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>

            <div
              onClick={() => fileRef.current.click()}
              className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-950 transition"
            >
              <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag & drop
              </p>
            </div>

            <input
              type="file"
              ref={fileRef}
              name="image"
              accept="image/*"
              className="hidden"
            />
          </div> */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>

            <div className='flex items-center justify-center'>
              {image && (
                <img
                  src={image}
                  alt="category"
                  className="w-20 h-10 object-cover rounded-lg mt-3"
                />
              )}
            </div>

            <div
              onClick={() => fileRef.current.click()}
              className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-950 transition"
            >
              <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to upload or drag & drop
              </p>
            </div>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setImage(URL.createObjectURL(file));
              }}
            />
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