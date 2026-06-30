import Link from 'next/link'
import { getColors } from '@/api/api-call'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'
import StatusBtn from '@/components/admin/StatusBtn'
import DeleteBtn from '@/components/admin/DeleteBtn'

export default async function ColorPage() {
  let colors = []

  try {
    const res = await getColors()
    colors = res.data || []
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2.5">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Color Management</h1>

          <Link href="/admin/color/create">
            <button className="flex items-center gap-2 bg-blue-950 text-white px-5 py-2 rounded-xl hover:bg-blue-900 cursor-pointer">
              <FiPlus />
              Add Color
            </button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="text-left p-4">Color</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Slug</th>
                <th className="text-left p-4">Status</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {colors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    No Color Found 😢
                  </td>
                </tr>
              ) : (
                colors.map((col) => (
                  <tr
                    key={col._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4">
                      <div
                        style={{ background: col.color_code || "#ffffff" }}
                        className="w-20 h-10 rounded-xl border"
                      ></div>
                    </td>

                    <td className="p-4 font-medium">{col.name}</td>

                    <td className="p-4 text-gray-600">{col.slug}</td>

                    <td className="p-4">
                      <StatusBtn
                        value={col.status}
                        url={`/color/status-update/${col._id}`}
                        field="status"
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link href={`/admin/color/edit/${col._id}`}>
                          <button className="bg-orange-100 text-orange-500 p-2 cursor-pointer rounded-lg hover:bg-orange-200">
                            <FaEdit />
                          </button>
                        </Link>

                        <DeleteBtn API={`/color/delete/${col._id}`} id={col._id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}