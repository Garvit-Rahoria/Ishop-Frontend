'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ThankYouClient() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-xl text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center rounded-full bg-green-100 text-4xl sm:text-5xl text-green-600 font-bold">
          ✓
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-5">
          Order Placed Successfully!
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed">
          Thank you for shopping with us. Your order has been confirmed.
        </p>

        <div className="bg-gray-100 rounded-2xl py-4 px-5 mt-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg sm:text-2xl font-bold text-green-600 mt-1 break-all">
            {orderId || 'N/A'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/profile"
            className="w-full sm:w-1/2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition text-center"
          >
            View orders
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-1/2 border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition text-center"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
