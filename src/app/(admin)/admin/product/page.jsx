import Link from 'next/link'
import { getProducts } from '@/api/api-call'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'
import StatusBtn from '@/components/admin/StatusBtn'
import DeleteBtn from '@/components/admin/DeleteBtn'
import { IoImages } from "react-icons/io5";
import ViewBtn from '@/components/admin/ViewBtn'


export default async function ProductPage() {
  let products = []
  let meta = {}

  try {
    const res = await getProducts()
    products = res.data
    meta = res.meta || {}
  } catch (error) {
    console.log(error)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2.5">
      <div className="bg-white rounded-2xl shadow p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>

          <Link href="/admin/product/create">
            <button className="flex items-center gap-2 bg-blue-950 text-white px-5 py-2 rounded-xl hover:bg-blue-900 cursor-pointer">
              <FiPlus />
              Add Product
            </button>
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">

            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="text-left p-4">Thumbnail</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Brand</th>
                <th className="text-left p-4">Color</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Top</th>
                <th className="text-center p-4">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {
                products?.length === 0
                  ? (
                    <tr>
                      <td colSpan="8" className="text-center p-6 text-gray-500">
                        No Product Found 😢
                      </td>
                    </tr>
                  )
                  : products.map((prod) => (
                    <tr
                      key={prod._id}
                      className="border-t hover:bg-gray-50 transition "
                    >
                      {/* Image */}
                      <td className="p-4">
                        <img
                          className="w-10 h-10 object-cover rounded"
                          src={`${process.env.NEXT_PUBLIC_PRODUCT_IMAGE}/${prod.thumbnail}`}
                          alt={prod.name}
                        />
                      </td>

                      {/* Name */}
                      <td className="p-4 font-medium">
                        {prod.name}
                      </td>

                      {/* category */}
                      <td className="p-4 text-gray-600">
                        {prod?.categoryId?.name}
                      </td>

                      {/* brand */}
                      <td className="p-4 text-gray-600">
                        {prod?.brandId?.name}
                      </td>

                      {/* color */}
                      <td className="p-4 text-gray-600">
                        {prod?.colorId?.[0]?.name || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBtn value={prod.status} url={`/product/status-update/${prod._id}`} field="status" />
                      </td>
                       {/* Top */}
                      <td className="p-4">
                        <StatusBtn value={prod.is_top} url={`/product/status-update/${prod._id}`} field="is_top" />
                      </td>


                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-center gap-3">

                          {/* Edit */}
                          <Link href={`/admin/product/edit/${prod._id}`}>
                            <button className="bg-orange-100 text-orange-500 p-2 cursor-pointer rounded-lg hover:bg-orange-200">
                              <FaEdit />
                            </button>
                          </Link>

                          {/* Add-images */}
                          <Link href={`/admin/product/add-images/${prod._id}`}>
                            <button className="bg-purple-100 text-purple-500 p-2 cursor-pointer rounded-lg hover:bg-purple-200">
                              <IoImages />
                            </button>
                          </Link>

                          {/* Delete */}
                          <DeleteBtn API={`/product/delete/${prod._id}`} />
                          <ViewBtn prod={prod}/>
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