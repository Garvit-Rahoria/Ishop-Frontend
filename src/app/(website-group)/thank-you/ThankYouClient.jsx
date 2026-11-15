'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Building2,
  Printer,
  Copy,
  Check,
  CreditCard,
  Banknote,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { client } from '@/utils/helper';

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Order received & logged' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Verified & packaged at hub' },
  { key: 'shipped', label: 'In Transit', desc: 'Dispatched from Swoo Hub' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier arriving today' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed over to customer' },
];

export default function ThankYouClient() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get('orderId');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch single order by ID or fall back to latest order from /order/my
  useEffect(() => {
    let isCancelled = false;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        if (urlOrderId) {
          const res = await client.get(`/order/${urlOrderId}`);
          if (!isCancelled) {
            if (res.data?.success && res.data?.order) {
              setOrder(res.data.order);
            } else {
              setError(res.data?.message || 'Order details not found');
            }
          }
        } else {
          // Fall back to user's latest order
          const res = await client.get('/order/my');
          if (!isCancelled) {
            const list = Array.isArray(res.data?.data) ? res.data.data : [];
            if (list.length > 0) {
              setOrder(list[0]);
            } else {
              setError('No recent orders found on this account.');
            }
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn('Failed to load order on thank you page:', err);
          setError(
            err?.response?.data?.message ||
              'Unable to load order details. Please verify your order in Profile.'
          );
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchOrder();
    return () => {
      isCancelled = true;
    };
  }, [urlOrderId]);

  const orderId = order?._id || urlOrderId;

  const handleCopy = () => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Helper date formatters
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getEstimatedDelivery = (dateStr) => {
    if (!dateStr) return 'Within 3 to 5 business days';
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 4);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Within 3 to 5 business days';
    }
  };

  // Tracking step index calculation
  const currentStepIndex = useMemo(() => {
    if (!order?.orderStatus) return 0;
    const s = order.orderStatus.toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'out_for_delivery') return 3;
    if (s === 'shipped') return 2;
    if (s === 'confirmed') return 1;
    if (s === 'placed') return 0;
    return 0; // cancelled / returned handled separately
  }, [order?.orderStatus]);

  const isCancelled = order?.orderStatus === 'cancelled';
  const isReturned = order?.orderStatus === 'returned';

  // Subtotal & discount calculation
  const itemsSubtotal = useMemo(() => {
    if (!order?.items || order.items.length === 0) return order?.totalAmount || 0;
    return order.items.reduce((sum, item) => sum + (item.total || item.price * item.qty || 0), 0);
  }, [order]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin flex items-center justify-center" />
          <Package className="w-8 h-8 text-teal-600 absolute inset-0 m-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Loading Order Confirmation...</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
          Fetching live tracking, warehouse origin, and delivery details.
        </p>
      </div>
    );
  }

  // Fallback if order not found at all
  if (!order && error) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Order Placed</h2>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          {urlOrderId && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 break-all">
              Order ID: {urlOrderId}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              href="/profile?tab=orders"
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <Package size={16} />
              <span>My Orders</span>
            </Link>
            <Link
              href="/products"
              className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#0b1120] py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Print-only CSS to format a clean invoice */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          header, footer, nav, .no-print {
            display: none !important;
          }
          .print-full {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8 print-full">
        {/* ==================================================================== */}
        {/* 1. HERO CELEBRATION & HEADER                                         */}
        {/* ==================================================================== */}
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
          {/* Decorative background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 dark:bg-teal-950/20 rounded-full blur-3xl -z-0 opacity-70 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-50 dark:bg-emerald-950/20 rounded-full blur-2xl -z-0 opacity-60 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
              {/* Success Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-11 h-11" strokeWidth={2.3} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center text-xs font-bold border-2 border-white dark:border-slate-800 shadow-xs">
                  <Sparkles size={12} />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Order Placed Successfully
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Thank you for your order!
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
                  We have received your order and our fulfillment team has started preparing it.
                  Confirmation has been sent to{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {order?.user?.email || order?.shippingAddress?.mobile || 'your registered contact'}
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Print & Share actions */}
            <div className="no-print flex items-center gap-2 self-stretch sm:self-auto justify-center">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs sm:text-sm transition shadow-xs cursor-pointer"
                title="Print or save PDF receipt"
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>

              <Link
                href="/profile?tab=orders"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-teal-600/20"
              >
                <Package size={16} />
                <span>My Orders</span>
              </Link>
            </div>
          </div>

          {/* Quick Meta Strip */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Order ID
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-800 truncate">
                  #{orderId?.slice(-8) || orderId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-teal-600 transition"
                  title="Copy full Order ID"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Order Placed On
              </span>
              <p className="font-bold text-xs sm:text-sm text-slate-800 mt-1 flex items-center gap-1 truncate">
                <Clock size={13} className="text-slate-400 flex-shrink-0" />
                <span>{formatDate(order?.createdAt)}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Payment Method
              </span>
              <p className="font-bold text-xs sm:text-sm text-slate-800 mt-1 flex items-center gap-1.5 capitalize">
                {order?.paymentMethod === 'cod' ? (
                  <Banknote size={14} className="text-emerald-600 flex-shrink-0" />
                ) : (
                  <CreditCard size={14} className="text-teal-600 flex-shrink-0" />
                )}
                <span>{order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Estimated Delivery
              </span>
              <p className="font-bold text-xs sm:text-sm text-emerald-900 mt-1 flex items-center gap-1 truncate">
                <Calendar size={13} className="text-emerald-600 flex-shrink-0" />
                <span>{getEstimatedDelivery(order?.createdAt)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. LIVE ORDER TRACKER ("WOH KAHA HAI ABHI")                          */}
        {/* ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <Truck size={14} />
                <span>Live Delivery Journey</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">Where is your package right now?</h2>
            </div>

            {/* Carrier & AWB Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Logistics Partner:</span>
              <span className="font-medium">Swoo Express / BlueDart</span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                AWB: SWO-{(orderId || '').slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Cancelled / Returned Alert */}
          {isCancelled && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0 text-red-500" />
              <div>
                <p className="font-bold text-sm">This order has been cancelled.</p>
                <p className="text-xs text-red-600">
                  If any payment was deducted, the refund will be credited back within 3-5 business days.
                </p>
              </div>
            </div>
          )}

          {isReturned && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0 text-amber-500" />
              <div>
                <p className="font-bold text-sm">Return request placed for this order.</p>
                <p className="text-xs text-amber-700">
                  Our courier executive will collect the item from your delivery address.
                </p>
              </div>
            </div>
          )}

          {/* Stepper (Only when not cancelled/returned) */}
          {!isCancelled && !isReturned && (
            <div className="mt-8">
              {/* Stepper Bar for Desktop/Tablet */}
              <div className="relative hidden md:block">
                {/* Background Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                {/* Active Progress Line */}
                <div
                  className="absolute top-6 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${(currentStepIndex / (TRACKING_STEPS.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center max-w-[130px]">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                            isCompleted
                              ? 'bg-emerald-500 text-white shadow-emerald-500/25 ring-4 ring-emerald-50'
                              : isCurrent
                              ? 'bg-teal-600 text-white ring-4 ring-teal-100 shadow-teal-600/30 animate-pulse'
                              : 'bg-white border-2 border-slate-300 text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={20} strokeWidth={2.8} />
                          ) : idx === 2 ? (
                            <Truck size={18} />
                          ) : idx === 4 ? (
                            <Package size={18} />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <span
                          className={`mt-3 text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-teal-700'
                              : isCompleted
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stepper for Mobile (Vertical) */}
              <div className="space-y-4 md:hidden">
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="flex items-start gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-teal-600 text-white ring-2 ring-teal-200 animate-pulse'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                      </div>
                      <div className="pt-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-bold ${
                              isCurrent ? 'text-teal-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                              Active Step
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Status Callout Box */}
              <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-white border border-teal-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                        Current Status
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-teal-700 border border-teal-200 shadow-2xs">
                        {order?.orderStatus?.replace(/_/g, ' ').toUpperCase() || 'PLACED'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mt-1">
                      {order?.orderStatus === 'placed' &&
                        'Your order has been verified and sent to Swoo Fulfillment Center for picking & packing.'}
                      {order?.orderStatus === 'confirmed' &&
                        'Order confirmed! Packaging is complete and the invoice has been generated.'}
                      {order?.orderStatus === 'shipped' &&
                        'Package has left Swoo Central Hub and is on the way to the delivery facility.'}
                      {order?.orderStatus === 'out_for_delivery' &&
                        'Delivery executive is out for delivery. You will receive an OTP / call upon arrival.'}
                      {order?.orderStatus === 'delivered' &&
                        'Package was delivered successfully to your shipping address.'}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right flex-shrink-0 pl-13 sm:pl-0">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Expected At Your Doorstep
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-teal-900 block mt-0.5">
                    {getEstimatedDelivery(order?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 3. ORIGIN & DESTINATION ("KAHA SE PLACE HUA / KAHA JAA RAHA HAI")    */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dispatch Origin Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-100 dark:shadow-none flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <span>Shipped From (Dispatch Origin)</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Swoo Central Fulfillment Hub #01
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                    Primary Warehouse
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Plot 42, Sector 18, Electronic City / Industrial Complex, Okhla Phase-III
                </p>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  New Delhi, Delhi - 110020, India
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-teal-600 dark:text-teal-400" />
                <span>100% Quality Inspected</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">GSTIN: 07AAACS1234F1Z5</span>
            </div>
          </div>

          {/* Delivery Destination Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-100 dark:shadow-none flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-4">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span>Delivering To (Shipping Destination)</span>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {order?.shippingAddress?.fullName || order?.user?.name || 'Customer'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {order?.shippingAddress?.addressLine || 'Address details on file'}
                </p>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                  {order?.shippingAddress?.city && `${order.shippingAddress.city}, `}
                  {order?.shippingAddress?.state && `${order.shippingAddress.state} - `}
                  {order?.shippingAddress?.pincode}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {order?.shippingAddress?.country || 'India'}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Phone size={13} className="text-slate-400 dark:text-slate-500" />
                <span>{order?.shippingAddress?.mobile || 'Phone on file'}</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Standard Home Delivery
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4. ORDER ITEMS & PAYMENT SUMMARY                                     */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ordered Products List (2 Columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/30 dark:shadow-none transition-colors">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Items in this Package</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {order?.items?.length || 0} product{(order?.items?.length || 0) > 1 ? 's' : ''} ordered
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Check size={12} strokeWidth={3} />
                <span>Verified Stock</span>
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {order?.items?.map((item, index) => {
                const prod = item.product_id || {};
                const name = prod.name || item.name || 'Electronic Product';
                const thumbnail =
                  prod.thumbnail ||
                  (Array.isArray(prod.image) && prod.image[0]) ||
                  '/placeholder.png';
                const itemPrice = item.price || prod.final_price || 0;
                const itemTotal = item.total || itemPrice * (item.qty || 1);
                const slug = prod.slug || prod._id;

                return (
                  <div
                    key={index}
                    className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200/80 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnail}
                          alt={name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://placehold.co/100x100/f1f5f9/475569?text=Product';
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={slug ? `/product/${slug}` : '#'}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-teal-600 transition line-clamp-2"
                        >
                          {name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            Qty: <strong className="text-slate-800">{item.qty}</strong>
                          </span>
                          <span className="text-xs text-slate-500">
                            ₹{itemPrice.toLocaleString('en-IN')} each
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Item Total Price */}
                    <div className="text-right sm:text-right self-end sm:self-auto pl-20 sm:pl-0 flex-shrink-0">
                      <span className="text-xs text-slate-400 block sm:hidden">Item Total</span>
                      <span className="font-extrabold text-base sm:text-lg text-slate-900">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Price Breakdown (1 Column) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-lg shadow-slate-200/30">
              <h2 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100">
                Payment & Billing
              </h2>

              {/* Payment Status Pill */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      order?.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order?.paymentMethod === 'cod' ? <Banknote size={18} /> : <CreditCard size={18} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {order?.paymentStatus === 'paid' ? 'Payment Verified' : 'Pay upon delivery'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    order?.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order?.paymentStatus || 'Pending'}
                </span>
              </div>

              {order?.razorpay_payment_id && (
                <div className="mt-3 px-3 py-2 bg-slate-50 rounded-xl text-[11px] font-mono text-slate-600 truncate border border-slate-100">
                  Transaction ID: {order.razorpay_payment_id}
                </div>
              )}

              {/* Price Calculation breakdown */}
              <div className="mt-6 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-800">
                    ₹{itemsSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Shipping & Delivery</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-teal-50 text-teal-700 font-bold rounded">
                      Promo
                    </span>
                  </span>
                  <span className="font-semibold text-emerald-600">
                    <span className="line-through text-slate-400 mr-1.5 font-normal">₹99</span>
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>GST / Applicable Taxes</span>
                  <span className="font-semibold text-slate-800">Included</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total Paid</span>
                  <span className="text-2xl font-black text-teal-700">
                    ₹{(order?.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Need Help / Support Box */}
            <div className="no-print bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
                <HelpCircle size={15} />
                <span>Need Assistance?</span>
              </div>
              <h3 className="text-base font-bold">Have questions about your order?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Our customer experience team is available 24/7 to help with shipping, returns, or product inquiries.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail size={14} className="text-teal-400" />
                  <span>support@swoo.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone size={14} className="text-teal-400" />
                  <span>+91 98765 43210 (Toll Free)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 5. BOTTOM NAVIGATION BAR                                            */}
        {/* ==================================================================== */}
        <div className="no-print bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
            <span>
              Your order is protected by the{' '}
              <strong className="text-slate-900">Swoo 7-Day Replacement Guarantee</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/profile?tab=orders"
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition text-center shadow-md flex items-center justify-center gap-2"
            >
              <Package size={16} />
              <span>Track All Orders</span>
            </Link>

            <Link
              href="/products"
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition text-center shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
