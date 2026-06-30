import Image from "next/image";

export default function ProductCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 w-full max-w-sm mx-auto">

      {/* Top Section */}
      <div className="relative flex justify-center">

        {/* Save Badge */}
        <span className="absolute left-0 top-0 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-md">
          SAVE $199.00
        </span>

        {/* Decorative circle */}
        <div className="absolute right-3 top-3 w-6 h-6 bg-gray-200 rounded-full"></div>

        <Image
          src="/images/ipad.png"
          alt="tablet"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Reviews */}
      <p className="text-center text-gray-400 text-sm mt-3">(152)</p>

      {/* Title */}
      <h3 className="text-gray-800 font-semibold text-center mt-1 leading-snug">
        OPod Pro 12.9 Inch M1 2023, 64Gb + Wifi, GPS
      </h3>

      {/* Price */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <span className="text-xl font-bold text-teal-600">$569.00</span>
        <span className="text-gray-400 line-through">$759.00</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-center mt-3">
        <span className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-medium">
          FREE SHIPPING
        </span>
      </div>

      {/* Stock */}
      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        In stock
      </div>

    </div>
  );
}