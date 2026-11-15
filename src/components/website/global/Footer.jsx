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
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h4 className="text-sm font-bold mb-3 tracking-wide text-slate-900 dark:text-white">
              SWOO TECH MART
            </h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
              Your destination for quality tech — phones, laptops, audio and more.
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-500">
              <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                Contact support
              </Link>
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold mb-4 text-slate-900 dark:text-slate-100">{col.title}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                {col.links.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-gray-500 dark:text-slate-500">
          <p>© {year} Swoo Tech Mart. All rights reserved.</p>
          <p>Prices in INR (₹)</p>
        </div>
      </div>
    </footer>
  )
}
