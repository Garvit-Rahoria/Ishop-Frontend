"use client"

import React from "react"
import { FaUsers, FaShoppingCart, FaRupeeSign, FaBox } from "react-icons/fa"

export default function Page() {
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: <FaUsers />,
      color: "bg-blue-500",
    },
    {
      title: "Orders",
      value: "320",
      icon: <FaShoppingCart />,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "₹45,000",
      icon: <FaRupeeSign />,
      color: "bg-yellow-500",
    },
    {
      title: "Products",
      value: "85",
      icon: <FaBox />,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-xl font-bold text-gray-800">
                {item.value}
              </h2>
            </div>
            <div
              className={`text-white p-3 rounded-full ${item.color}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3">
          <li className="text-gray-600 text-sm">
            🟢 New user registered
          </li>
          <li className="text-gray-600 text-sm">
            🛒 Order #1234 placed
          </li>
          <li className="text-gray-600 text-sm">
            💰 Payment received ₹2,000
          </li>
          <li className="text-gray-600 text-sm">
            📦 Product added
          </li>
        </ul>
      </div>

    </div>
  )
}