import Link from "next/link";
import {
  Users,
  ShoppingBag,
  IndianRupee,
  Package,
  Layers,
  Sparkles,
  Palette,
  Clock,
  ArrowUpRight,
  Plus,
  ChevronRight,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getDashboard, getMe } from "@/api/api-call";
import { resolveMediaUrl } from "@/utils/media";
import {
  formatCurrency,
  formatDate,
  getOrderStatusMeta,
  getPaymentMeta,
} from "@/utils/adminFormatters";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [dash, me] = await Promise.all([getDashboard(), getMe()]);
  const data = dash?.data || {};
  const counts = data.counts || {};
  const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : [];
  const recentProducts = Array.isArray(data.recentProducts) ? data.recentProducts : [];
  const adminName = me?.user?.name || "Admin";

  const primaryStats = [
    {
      title: "Total Revenue",
      value: formatCurrency(counts.revenue),
      subtext: "Lifetime store earnings",
      icon: <IndianRupee size={22} />,
      href: "/admin/order",
      gradient: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      title: "Total Orders",
      value: counts.orders ?? 0,
      subtext: `${counts.pendingOrders ?? 0} orders pending`,
      icon: <ShoppingBag size={22} />,
      href: "/admin/order",
      gradient: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      title: "Total Products",
      value: counts.products ?? 0,
      subtext: "Active in catalog",
      icon: <Package size={22} />,
      href: "/admin/product",
      gradient: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      title: "Registered Users",
      value: counts.users ?? 0,
      subtext: "Customer accounts",
      icon: <Users size={22} />,
      href: "/admin/users",
      gradient: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  const secondaryStats = [
    {
      title: "Categories",
      value: counts.categories ?? 0,
      icon: <Layers size={16} />,
      href: "/admin/category",
    },
    {
      title: "Brands",
      value: counts.brands ?? 0,
      icon: <Sparkles size={16} />,
      href: "/admin/brand",
    },
    {
      title: "Colors",
      value: counts.colors ?? 0,
      icon: <Palette size={16} />,
      href: "/admin/color",
    },
    {
      title: "Pending Orders",
      value: counts.pendingOrders ?? 0,
      icon: <Clock size={16} />,
      href: "/admin/order",
      alert: (counts.pendingOrders ?? 0) > 0,
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80">
              <TrendingUp size={13} />
              <span>Live Store</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{adminName}</span>. Here is what is happening with your store today.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/product/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm shadow-teal-600/25 transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/category/create"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Category</span>
          </Link>
          <Link
            href="/admin/order"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition cursor-pointer"
          >
            <span>Manage Orders</span>
            <ArrowUpRight size={14} className="text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {primaryStats.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {item.title}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-teal-600 transition-colors">
                  {item.value}
                </h3>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr ${item.gradient} shadow-md shrink-0 group-hover:scale-105 transition-transform`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{item.subtext}</span>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {secondaryStats.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.href}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
              stat.alert
                ? "bg-amber-50/70 border-amber-200 text-amber-900 hover:bg-amber-100/70"
                : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`p-2 rounded-lg ${stat.alert ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                {stat.icon}
              </span>
              <span className="text-xs font-semibold truncate">{stat.title}</span>
            </div>
            <span className="text-sm font-black tracking-tight ml-2">
              {stat.value}
            </span>
          </Link>
        ))}
      </div>

      {/* Payment Channels Overview */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-teal-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">
              Payment Breakdown
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of orders placed across payment gateways
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Paid:</span>
            <span className="text-sm font-bold text-white">{counts.paidOrders ?? 0}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-xs font-medium text-slate-300">Razorpay Online:</span>
            <span className="text-sm font-bold text-white">{counts.onlineOrders ?? 0}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3.5 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-slate-300">Cash on Delivery:</span>
            <span className="text-sm font-bold text-white">{counts.codOrders ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Tables Section: Recent Orders & Latest Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Recent Orders Table */}
        <section className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Orders
              </h2>
              <p className="text-[11px] text-slate-400">
                Latest customer purchases
              </p>
            </div>
            <Link
              href="/admin/order"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <ShoppingBag size={32} className="mx-auto mb-2 text-slate-300" />
              <p>No customer orders yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const orderIdShort = String(order._id || "").slice(-8).toUpperCase();
                const statusMeta = getOrderStatusMeta(order.orderStatus);
                const paymentMeta = getPaymentMeta(order.paymentMethod, order.paymentStatus);
                const customerName = order.user?.name || "Customer";
                const customerEmail = order.user?.email || "—";
                const initials = customerName.slice(0, 2).toUpperCase();

                const itemCount = (order.items || []).length;
                const itemsSummary = (order.items || [])
                  .map((i) => i.product_id?.name || "Product")
                  .slice(0, 2)
                  .join(", ");
                const extraItems = itemCount > 2 ? ` +${itemCount - 2} more` : "";

                return (
                  <li
                    key={order._id}
                    className="p-4 hover:bg-slate-50/80 transition flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Customer Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {customerName}
                          </p>
                          <span className="text-[11px] font-mono text-slate-400 font-normal">
                            #{orderIdShort}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {itemsSummary}
                          <span className="text-slate-400">{extraItems}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${paymentMeta.bg} ${paymentMeta.text} ${paymentMeta.border}`}
                          >
                            <span>{paymentMeta.badge}</span>
                            <span>·</span>
                            <span>{order.paymentStatus || "pending"}</span>
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                            <span>{statusMeta.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Total & Date */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Latest Products */}
        <section className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Latest Products
              </h2>
              <p className="text-[11px] text-slate-400">
                Recently added to store catalog
              </p>
            </div>
            <Link
              href="/admin/product"
              className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
            >
              <span>View Catalog</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Package size={32} className="mx-auto mb-2 text-slate-300" />
              <p>No products in store yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentProducts.map((product) => {
                const inStock = Boolean(product.stock);
                const isActive = Boolean(product.status);

                return (
                  <li key={product._id}>
                    <Link
                      href={`/admin/product/edit/${product._id}`}
                      className="p-4 flex items-center gap-3 hover:bg-slate-50/80 transition group"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 p-1 flex items-center justify-center group-hover:border-teal-400 transition">
                        <img
                          src={resolveMediaUrl("", product.thumbnail) || "/placeholder.svg"}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-teal-600 transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-teal-700">
                            {formatCurrency(product.final_price)}
                          </span>
                          {product.orginal_price && product.orginal_price > product.final_price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatCurrency(product.orginal_price)}
                            </span>
                          )}
                          <span className="text-slate-300">·</span>
                          <span
                            className={`text-[11px] font-semibold ${
                              inStock ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
