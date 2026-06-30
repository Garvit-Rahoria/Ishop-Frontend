import BestSellerCard from '@/components/website/global/BestSellerCard'

export default function RecentlyViewedRow() {

  const products = [
    {
      image: '/products/watch.png',
      title: 'Xomie Remid 8 Sport Water Resistance Watch',
      price: 579,
      badges: ['NEW'],
    },
    {
      image: '/products/laptop.png',
      title: 'Microte Surface 2.0 Laptop',
      price: 979,
      badges: ['NEW'],
    },
    {
      image: '/products/tablet.png',
      title: 'aPod Pro Tablet 2023 LTE + Wifi, GPS Cellular 12.9 Inch',
      price: '979 - 1,259',
      save: 192,
    },
    {
      image: '/products/phone.png',
      title: 'SROK Smart Phone 128GB, Gold Retina',
      price: 579,
      oldPrice: 779,
      save: 192,
    },
  ]

  return (
    <div className="bg-white rounded-xl p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold uppercase">
          Your Recently Viewed
        </h4>

        <span className="text-sm text-gray-500 hover:text-teal-500 cursor-pointer">
          View All
        </span>
      </div>

      {/* Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <BestSellerCard key={index} {...product} />
        ))}
      </div>

    </div>
  )
}
