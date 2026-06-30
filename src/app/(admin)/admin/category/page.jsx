import Link from 'next/link'
import { getCategories } from '@/api/api-call'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'
import StatusBtn from '@/components/admin/StatusBtn'
import DeleteBtn from '@/components/admin/DeleteBtn'

export default async function CategoryPage() {
  let categories = []
  let meta = {}

  try {
    const res = await getCategories()
    console.log(res)
    categories = res.data
    meta = res.meta || {}
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2.5">
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Category Management</h1>

          <Link href="/admin/category/create">
            <button className="flex items-center gap-2 bg-blue-950 text-white px-5 py-2 rounded-xl hover:bg-blue-900 cursor-pointer">
              <FiPlus />
              Add Category
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">

            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Slug</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Home</th>
                <th className="text-left p-4">Top</th>
                <th className="text-left p-4">Popular</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {
                categories?.length === 0
                  ? (
                    <tr>
                      <td colSpan="8" className="text-center p-6 text-gray-500">
                        No Category Found 😢
                      </td>
                    </tr>
                  )
                  : categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="border-t hover:bg-gray-50 transition "
                    >
                      {/* Image */}
                      <td className="p-4">
                        <img
                          className="w-10 h-10 object-cover rounded"
                          src={`${process.env.NEXT_PUBLIC_CATEGORY_IMAGE}/${cat.image}`}
                          alt={cat.name}
                        />
                      </td>

                      {/* Name */}
                      <td className="p-4 font-medium">
                        {cat.name}
                      </td>

                      {/* Slug */}
                      <td className="p-4 text-gray-600">
                        {cat.slug}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBtn value={cat.status} url={`/category/status-update/${cat._id}`} field="status" />
                      </td>

                      {/* Home */}
                      <td className="p-4">
                        <StatusBtn value={cat.is_home} url={`/category/status-update/${cat._id}`} field="is_home" />
                      </td>

                      {/* Top */}
                      <td className="p-4">
                        <StatusBtn value={cat.is_top} url={`/category/status-update/${cat._id}`} field="is_top" />
                      </td>

                      {/* Popular */}
                      <td className="p-4">
                        <StatusBtn value={cat.is_popular} url={`/category/status-update/${cat._id}`} field="is_popular" />
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center gap-3">

                          {/* Edit */}
                          <Link href={`/admin/category/edit/${cat._id}`}>
                            <button className="bg-orange-100 text-orange-500 p-2 cursor-pointer rounded-lg hover:bg-orange-200">
                              <FaEdit />
                            </button>
                          </Link>

                          {/* Delete */}
                          <DeleteBtn API={`/category/delete/${cat._id}`} />

                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>

          </table>
        </div>

      </div>
    </div>
  )
}