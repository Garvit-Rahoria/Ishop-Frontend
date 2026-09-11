import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    {
      title: 'Shop',
      links: [
        { label: 'All products', href: '/products' },
        { label: 'Deals', href: '/products' },
        { label: 'Cart', href: '/cart' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
        { label: 'My profile', href: '/profile' },
      ],
    },
  ]

  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-semibold mb-3 tracking-wide">
              SWOO TECH MART
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Your destination for quality tech — phones, laptops, audio and more.
            </p>
            <p className="text-sm text-gray-500">
              <Link href="/contact" className="hover:text-teal-600 transition">
                Contact support
              </Link>
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {col.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="hover:text-teal-600 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-gray-500">
          <p>© {year} Swoo Tech Mart. All rights reserved.</p>
          <p>Prices in INR (₹)</p>
        </div>
      </div>
    </footer>
  )
}
