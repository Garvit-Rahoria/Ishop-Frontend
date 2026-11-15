'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    Package,
    Plus,
    Trash2,
    Calendar,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Loader2,
    LogOut,
    ExternalLink,
    AlertCircle,
    Copy,
    Check,
    Truck,
    Clock,
    Printer,
    Banknote,
    CreditCard,
    Building2,
    RotateCcw,
    XCircle,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { client, notify } from '@/utils/helper';
import { resolveMediaUrl } from '@/utils/media';

const TRACKING_STEPS = [
    { key: 'placed', label: 'Placed', desc: 'Order logged' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Packed at Hub' },
    { key: 'shipped', label: 'In Transit', desc: 'Dispatched' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier nearby' },
    { key: 'delivered', label: 'Delivered', desc: 'Completed' },
];

export default function ProfilePage({ user: initialUser }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser || null);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'account'

    const [addresses, setAddresses] = useState(
        Array.isArray(initialUser?.addresses) ? initialUser.addresses : []
    );
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'active' | 'delivered' | 'cancelled'

    // Add Address Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: initialUser?.name || '',
        mobile: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: '',
        country: 'India',
    });

    // Copy order ID state
    const [copiedOrderId, setCopiedOrderId] = useState(null);

    // Fetch latest user data
    useEffect(() => {
        client
            .get('/user/get')
            .then((res) => {
                if (res.data.success && res.data.user) {
                    setUser(res.data.user);
                    setAddresses(Array.isArray(res.data.user.addresses) ? res.data.user.addresses : []);
                }
            })
            .catch(() => {});
    }, []);

    // Fetch user orders
    useEffect(() => {
        let isCancelled = false;
        setOrdersLoading(true);
        client
            .get('/order/my')
            .then((res) => {
                if (!isCancelled) {
                    setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
                }
            })
            .catch(() => {
                if (!isCancelled) setOrders([]);
            })
            .finally(() => {
                if (!isCancelled) setOrdersLoading(false);
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    // Filtered orders
    const filteredOrders = useMemo(() => {
        if (orderFilter === 'all') return orders;
        if (orderFilter === 'active') {
            return orders.filter((o) =>
                ['placed', 'confirmed', 'shipped', 'out_for_delivery'].includes(
                    (o.orderStatus || '').toLowerCase()
                )
            );
        }
        if (orderFilter === 'delivered') {
            return orders.filter((o) => (o.orderStatus || '').toLowerCase() === 'delivered');
        }
        if (orderFilter === 'cancelled') {
            return orders.filter((o) =>
                ['cancelled', 'returned'].includes((o.orderStatus || '').toLowerCase())
            );
        }
        return orders;
    }, [orders, orderFilter]);

    // Handle Cancel Order
    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Cancel this order?',
            text: 'Are you sure you want to cancel? If you paid online, the refund will be credited back within 3-5 business days.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Cancel Order',
            cancelButtonText: 'No, Keep Order',
            reverseButtons: true,
            customClass: { popup: 'rounded-2xl' },
        });

        if (!result.isConfirmed) return;

        try {
            const res = await client.patch(`/order/${orderId}/cancel`);
            if (res.data?.success) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'cancelled' } : o))
                );
                notify('Order cancelled successfully', true);
            } else {
                notify(res.data?.message || 'Failed to cancel order', false);
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Error cancelling order', false);
        }
    };

    // Handle Return Order
    const handleReturnOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Request Return / Replacement?',
            text: 'Our courier will pick up the item from your delivery address within 2-3 business days.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0f766e',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Request Return',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            customClass: { popup: 'rounded-2xl' },
        });

        if (!result.isConfirmed) return;

        try {
            const res = await client.patch(`/order/${orderId}/return`);
            if (res.data?.success) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, orderStatus: 'returned' } : o))
                );
                notify('Return request registered successfully', true);
            } else {
                notify(res.data?.message || 'Failed to request return', false);
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Error requesting return', false);
        }
    };

    // Date & tracking helpers
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
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
        if (!dateStr) return 'Within 3-5 business days';
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
            return 'Within 3-5 business days';
        }
    };

    const getStepIndex = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'delivered') return 4;
        if (s === 'out_for_delivery') return 3;
        if (s === 'shipped') return 2;
        if (s === 'confirmed') return 1;
        if (s === 'placed') return 0;
        return 0;
    };

    // Handle Add Address
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const { fullName, mobile, pincode, addressLine, city, state } = addressForm;
        if (!fullName || !mobile || !pincode || !addressLine || !city || !state) {
            notify('Please fill all required address fields', false);
            return;
        }

        setAddressLoading(true);
        try {
            const res = await client.post('/user/addAddress', addressForm);
            if (res.data.success) {
                const nextAddresses = res.data.addresses || res.data.addAddress || [];
                setAddresses(nextAddresses);
                setShowAddForm(false);
                setAddressForm({
                    fullName: user?.name || '',
                    mobile: '',
                    pincode: '',
                    addressLine: '',
                    city: '',
                    state: '',
                    country: 'India',
                });
                notify('New delivery address added successfully!', true);
            } else {
                notify(res.data.message || 'Failed to add address', false);
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Failed to add address', false);
        } finally {
            setAddressLoading(false);
        }
    };

    // Handle Delete Address
    const handleDeleteAddress = async (index, addrName) => {
        const confirm = await Swal.fire({
            title: 'Remove address?',
            text: `Are you sure you want to delete delivery address for "${addrName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete',
            reverseButtons: true,
            customClass: { popup: 'rounded-2xl' },
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await client.delete(`/user/address/${index}`);
            if (res.data.success) {
                setAddresses((prev) => prev.filter((_, i) => i !== index));
                notify('Address removed successfully', true);
            } else {
                notify(res.data.message || 'Failed to remove address', false);
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Failed to remove address', false);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await client.post('/user/logout');
        } catch (_) {}
        localStorage.removeItem('jwt');
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        notify('Logged out successfully', true);
        router.push('/login');
        router.refresh();
    };

    const copyToClipboard = (orderId) => {
        if (!navigator?.clipboard) return;
        navigator.clipboard.writeText(orderId);
        setCopiedOrderId(orderId);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
    const userInitial = user?.name ? user.name[0].toUpperCase() : 'U';

    return (
        <section className="bg-slate-50/70 dark:bg-[#0b1120] min-h-screen py-8 md:py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* ============================================================ */}
                {/* USER HERO BANNER                                             */}
                {/* ============================================================ */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-6 md:p-8 transition-colors">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* Profile Info */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
                                {userInitial}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                                        {user?.name || 'Customer Account'}
                                    </h1>
                                    {isAdmin ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                                            <ShieldCheck size={12} />
                                            <span>Administrator</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                                            <CheckCircle2 size={12} />
                                            <span>Verified Customer</span>
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                    <Mail size={13} className="text-slate-400 dark:text-slate-500" />
                                    <span>{user?.email || '—'}</span>
                                </p>

                                {addresses?.[0]?.mobile ? (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                                        <Phone size={12} className="text-slate-400 dark:text-slate-500" />
                                        <span>+91 {addresses[0].mobile}</span>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* Quick Action Badges / Controls */}
                        <div className="flex flex-wrap items-center gap-3">
                            {isAdmin ? (
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
                                >
                                    <ShieldCheck size={14} />
                                    <span>Open Admin Portal</span>
                                </Link>
                            ) : null}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 transition cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 dark:text-slate-500 font-medium">Orders Placed</span>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{orders.length}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 dark:text-slate-500 font-medium">Saved Addresses</span>
                            <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{addresses.length}</p>
                        </div>
                        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 dark:text-slate-500 font-medium">Email Status</span>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                <CheckCircle2 size={13} />
                                <span>Verified</span>
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 dark:text-slate-500 font-medium">Account Status</span>
                            <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-1">Active</p>
                        </div>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* TAB CONTROLS                                                 */}
                {/* ============================================================ */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                            activeTab === 'orders'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        <Package size={16} />
                        <span>My Orders ({orders.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('addresses')}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                            activeTab === 'addresses'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        <MapPin size={16} />
                        <span>Delivery Addresses ({addresses.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('account')}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                            activeTab === 'account'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-800'
                        }`}
                    >
                        <User size={16} />
                        <span>Account Details</span>
                    </button>
                </div>

                {/* ============================================================ */}
                {/* TAB CONTENT 1: MY ORDERS (OVERHAULED & COMPLETE)             */}
                {/* ============================================================ */}
                {activeTab === 'orders' ? (
                    <div className="space-y-6">
                        {/* Order Filters Header */}
                        {orders.length > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                    <ShoppingBag size={15} className="text-teal-600" />
                                    <span>Filter Orders:</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    {[
                                        { key: 'all', label: `All (${orders.length})` },
                                        {
                                            key: 'active',
                                            label: `In Progress (${
                                                orders.filter((o) =>
                                                    ['placed', 'confirmed', 'shipped', 'out_for_delivery'].includes(
                                                        (o.orderStatus || '').toLowerCase()
                                                    )
                                                ).length
                                            })`,
                                        },
                                        {
                                            key: 'delivered',
                                            label: `Delivered (${
                                                orders.filter((o) => (o.orderStatus || '').toLowerCase() === 'delivered').length
                                            })`,
                                        },
                                        {
                                            key: 'cancelled',
                                            label: `Cancelled (${
                                                orders.filter((o) =>
                                                    ['cancelled', 'returned'].includes((o.orderStatus || '').toLowerCase())
                                                ).length
                                            })`,
                                        },
                                    ].map((f) => (
                                        <button
                                            key={f.key}
                                            type="button"
                                            onClick={() => setOrderFilter(f.key)}
                                            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                                                orderFilter === f.key
                                                    ? 'bg-teal-600 text-white shadow-2xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {ordersLoading ? (
                            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
                                <Loader2 size={32} className="animate-spin text-teal-600 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-700">Loading Order History...</p>
                                <p className="text-xs text-slate-400 mt-1">Retrieving tracking, address, and product details</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                                    <ShoppingBag size={30} />
                                </div>
                                <h3 className="font-extrabold text-lg text-slate-900">
                                    {orderFilter === 'all' ? 'No Orders Placed Yet' : 'No Orders in this Category'}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                                    Explore our premium electronics, audio speakers, headphones, and smart gadgets to place your first order.
                                </p>
                                <div className="pt-2">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-teal-600/20"
                                    >
                                        <span>Browse Products</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            filteredOrders.map((order) => {
                                const status = String(order.orderStatus || 'placed').toLowerCase();
                                const isDelivered = status === 'delivered';
                                const isCancelled = status === 'cancelled';
                                const isReturned = status === 'returned';
                                const canCancel = ['placed', 'confirmed'].includes(status);
                                const stepIdx = getStepIndex(status);

                                // Robust address fallback: order.shippingAddress or order.address
                                const addr = order.shippingAddress || order.address || {};
                                const orderTotal = Number(order.totalAmount || 0);

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white border border-slate-200/90 rounded-3xl shadow-xs hover:border-slate-300 transition-all overflow-hidden"
                                    >
                                        {/* ==================================================== */}
                                        {/* 1. ORDER CARD HEADER STRIP                           */}
                                        {/* ==================================================== */}
                                        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                                            {/* Left: Metadata */}
                                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                                <div>
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                                        Order Placed
                                                    </span>
                                                    <span className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                                        <Calendar size={13} className="text-slate-400" />
                                                        <span>{formatDate(order.createdAt)}</span>
                                                    </span>
                                                </div>

                                                <div className="hidden sm:block h-7 w-px bg-slate-200" />

                                                <div>
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                                        Total Paid
                                                    </span>
                                                    <span className="font-extrabold text-sm text-teal-700 mt-0.5">
                                                        ₹{orderTotal.toLocaleString('en-IN')}
                                                    </span>
                                                </div>

                                                <div className="hidden sm:block h-7 w-px bg-slate-200" />

                                                <div>
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                                        Ship To
                                                    </span>
                                                    <span className="font-bold text-slate-800 mt-0.5 truncate max-w-[130px] block">
                                                        {addr.fullName || user?.name || 'Customer'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right: Order ID & Actions */}
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                                                    <span className="text-slate-400 font-medium">Order ID:</span>
                                                    <span className="font-mono font-bold text-slate-800">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(order._id)}
                                                        className="p-1 text-slate-400 hover:text-teal-600 transition cursor-pointer"
                                                        title="Copy full Order ID"
                                                    >
                                                        {copiedOrderId === order._id ? (
                                                            <Check size={12} className="text-emerald-600" />
                                                        ) : (
                                                            <Copy size={12} />
                                                        )}
                                                    </button>
                                                </div>

                                                <Link
                                                    href={`/thank-you?orderId=${order._id}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-2xs"
                                                    title="Open live tracking page"
                                                >
                                                    <Truck size={13} />
                                                    <span>Live Tracking</span>
                                                    <ExternalLink size={11} />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* ==================================================== */}
                                        {/* 2. LIVE ORDER JOURNEY TRACKER                        */}
                                        {/* ==================================================== */}
                                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-teal-50/30 to-transparent">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                            isDelivered
                                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                                : isCancelled
                                                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                                                : isReturned
                                                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                                : status === 'shipped'
                                                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                                                : 'bg-teal-100 text-teal-800 border border-teal-200'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-2 h-2 rounded-full ${
                                                                isDelivered
                                                                    ? 'bg-emerald-500'
                                                                    : isCancelled
                                                                    ? 'bg-rose-500'
                                                                    : 'bg-teal-500 animate-pulse'
                                                            }`}
                                                        />
                                                        <span>{status.replace(/_/g, ' ')}</span>
                                                    </span>

                                                    <span className="text-xs font-bold text-slate-800">
                                                        {isDelivered
                                                            ? `Delivered on ${formatDate(order.deliveredAt || order.updatedAt)}`
                                                            : isCancelled
                                                            ? 'Order Cancelled'
                                                            : isReturned
                                                            ? 'Return Request In Progress'
                                                            : `Expected Delivery by: ${getEstimatedDelivery(order.createdAt)}`}
                                                    </span>
                                                </div>

                                                <div className="text-xs text-slate-500 font-medium">
                                                    Courier: <span className="text-slate-800 font-semibold">Swoo Express / BlueDart</span> (AWB: SWO-{order._id.slice(-8).toUpperCase()})
                                                </div>
                                            </div>

                                            {/* Stepper Pipeline (Desktop) */}
                                            {!isCancelled && !isReturned && (
                                                <div className="relative mt-4">
                                                    <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full" />
                                                    <div
                                                        className="absolute top-4 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${(stepIdx / (TRACKING_STEPS.length - 1)) * 100}%`,
                                                        }}
                                                    />

                                                    <div className="relative flex justify-between">
                                                        {TRACKING_STEPS.map((step, idx) => {
                                                            const isDone = idx < stepIdx;
                                                            const isCurrent = idx === stepIdx;
                                                            return (
                                                                <div
                                                                    key={step.key}
                                                                    className="flex flex-col items-center text-center max-w-[100px]"
                                                                >
                                                                    <div
                                                                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                                                                            isDone
                                                                                ? 'bg-emerald-500 text-white'
                                                                                : isCurrent
                                                                                ? 'bg-teal-600 text-white ring-2 ring-teal-200 animate-pulse'
                                                                                : 'bg-white border border-slate-300 text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {isDone ? (
                                                                            <Check size={14} strokeWidth={3} />
                                                                        ) : (
                                                                            idx + 1
                                                                        )}
                                                                    </div>
                                                                    <span
                                                                        className={`mt-1.5 text-[11px] font-bold ${
                                                                            isCurrent
                                                                                ? 'text-teal-700'
                                                                                : isDone
                                                                                ? 'text-slate-800'
                                                                                : 'text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {step.label}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* ==================================================== */}
                                        {/* 3. ORDER BODY: PRODUCTS & LOGISTICS DETAILS          */}
                                        {/* ==================================================== */}
                                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Products List (2 cols) */}
                                            <div className="lg:col-span-2 space-y-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    Ordered Items ({order.items?.length || 0})
                                                </h4>

                                                <div className="divide-y divide-slate-100">
                                                    {(order.items || []).map((item, idx) => {
                                                        const prod = item.product_id || {};
                                                        const thumb = resolveMediaUrl(
                                                            '',
                                                            prod.thumbnail || (Array.isArray(prod.image) && prod.image[0])
                                                        );
                                                        const price = Number(item.price || prod.final_price || 0);
                                                        const total = Number(item.total || price * (item.qty || 1));
                                                        const slug = prod.slug || prod._id;

                                                        return (
                                                            <div
                                                                key={idx}
                                                                className="py-3 flex items-center justify-between gap-4"
                                                            >
                                                                <div className="flex items-center gap-3.5 min-w-0">
                                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                                        {thumb ? (
                                                                            <img
                                                                                src={thumb}
                                                                                alt={prod.name || 'Product'}
                                                                                className="w-full h-full object-contain"
                                                                                onError={(e) => {
                                                                                    e.currentTarget.src =
                                                                                        'https://placehold.co/100x100/f1f5f9/475569?text=Product';
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <ShoppingBag size={20} className="text-slate-300" />
                                                                        )}
                                                                    </div>

                                                                    <div className="min-w-0 flex-1">
                                                                        {slug ? (
                                                                            <Link
                                                                                href={`/product/${slug}`}
                                                                                className="font-bold text-xs sm:text-sm text-slate-900 hover:text-teal-600 transition truncate block"
                                                                            >
                                                                                {prod.name || 'Purchased Gadget'}
                                                                            </Link>
                                                                        ) : (
                                                                            <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                                                                {prod.name || 'Purchased Gadget'}
                                                                            </p>
                                                                        )}

                                                                        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                                                                            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                                                                                Qty: {item.qty}
                                                                            </span>
                                                                            <span>₹{price.toLocaleString('en-IN')} each</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right shrink-0">
                                                                    <span className="font-extrabold text-sm text-slate-900">
                                                                        ₹{total.toLocaleString('en-IN')}
                                                                    </span>
                                                                    {slug && (
                                                                        <Link
                                                                            href={`/product/${slug}`}
                                                                            className="block text-[11px] font-bold text-teal-600 hover:underline mt-1"
                                                                        >
                                                                            View Item
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Logistics Origin & Destination Box (1 col) */}
                                            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4 flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    {/* Origin */}
                                                    <div>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                                            <Building2 size={13} className="text-slate-400" />
                                                            <span>Dispatched From</span>
                                                        </div>
                                                        <p className="font-bold text-xs text-slate-800">
                                                            Swoo Fulfillment Hub #01
                                                        </p>
                                                        <p className="text-[11px] text-slate-500">
                                                            New Delhi Industrial Complex, Delhi - 110020
                                                        </p>
                                                    </div>

                                                    <div className="h-px bg-slate-200" />

                                                    {/* Destination */}
                                                    <div>
                                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                                                            <MapPin size={13} className="text-teal-600" />
                                                            <span>Shipping Destination</span>
                                                        </div>
                                                        <p className="font-bold text-xs text-slate-900">
                                                            {addr.fullName || user?.name || 'Customer'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                                            {addr.addressLine || 'Address on record'}
                                                        </p>
                                                        <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                                                            {addr.city ? `${addr.city}, ` : ''}
                                                            {addr.state ? `${addr.state} ` : ''}
                                                            {addr.pincode ? `- ${addr.pincode}` : ''}
                                                        </p>
                                                        {addr.mobile && (
                                                            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                                                <Phone size={10} />
                                                                <span>+91 {addr.mobile}</span>
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="h-px bg-slate-200" />

                                                    {/* Payment info */}
                                                    <div>
                                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                                            Payment Mode
                                                        </span>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="font-bold text-slate-800 flex items-center gap-1.5 capitalize">
                                                                {order.paymentMethod === 'cod' ? (
                                                                    <Banknote size={14} className="text-emerald-600" />
                                                                ) : (
                                                                    <CreditCard size={14} className="text-teal-600" />
                                                                )}
                                                                <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}</span>
                                                            </span>
                                                            <span
                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                                    order.paymentStatus === 'paid'
                                                                        ? 'bg-emerald-100 text-emerald-800'
                                                                        : 'bg-amber-100 text-amber-800'
                                                                }`}
                                                            >
                                                                {order.paymentStatus || 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ==================================================== */}
                                        {/* 4. ORDER CARD FOOTER ACTIONS                         */}
                                        {/* ==================================================== */}
                                        <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <ShieldCheck size={14} className="text-teal-600" />
                                                <span>Protected by 7-Day Replacement Policy</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {/* Cancel Order Action */}
                                                {canCancel && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition cursor-pointer"
                                                    >
                                                        <XCircle size={13} />
                                                        <span>Cancel Order</span>
                                                    </button>
                                                )}

                                                {/* Return Order Action */}
                                                {isDelivered && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReturnOrder(order._id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 transition cursor-pointer"
                                                    >
                                                        <RotateCcw size={13} />
                                                        <span>Request Return</span>
                                                    </button>
                                                )}

                                                <Link
                                                    href={`/thank-you?orderId=${order._id}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-2xs"
                                                >
                                                    <Truck size={14} />
                                                    <span>View Tracking Details</span>
                                                    <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : null}

                {/* ============================================================ */}
                {/* TAB CONTENT 2: SAVED ADDRESSES                               */}
                {/* ============================================================ */}
                {activeTab === 'addresses' ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-extrabold text-slate-900">
                                    Saved Delivery Locations
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Manage your primary addresses for fast, one-click checkout
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>{showAddForm ? 'Close Form' : 'Add New Address'}</span>
                            </button>
                        </div>

                        {/* Inline Add Address Form Drawer */}
                        {showAddForm ? (
                            <div className="bg-white border border-teal-200/80 rounded-3xl p-6 shadow-xs animate-in fade-in duration-150 space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-teal-700 font-extrabold text-sm">
                                        <MapPin size={16} />
                                        <span>Add New Address</span>
                                    </div>
                                    <span className="text-xs text-slate-400">All fields marked with * are required</span>
                                </div>

                                <form onSubmit={handleSaveAddress} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Recipient name"
                                                value={addressForm.fullName}
                                                onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Mobile Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="10-digit mobile number"
                                                value={addressForm.mobile}
                                                onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Street / Flat / Colony Address *
                                        </label>
                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="House no., apartment name, street name, area..."
                                            value={addressForm.addressLine}
                                            onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="City"
                                                value={addressForm.city}
                                                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="State"
                                                value={addressForm.state}
                                                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                Pincode *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="6-digit Pincode"
                                                value={addressForm.pincode}
                                                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 text-xs sm:text-sm outline-none transition"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={addressLoading}
                                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
                                        >
                                            {addressLoading ? (
                                                <>
                                                    <Loader2 size={13} className="animate-spin" />
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <span>Save Address</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : null}

                        {/* Saved Address Cards */}
                        {addresses.length === 0 ? (
                            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-bold text-sm text-slate-800">No Addresses Saved Yet</h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    Add your delivery address for fast checkout when purchasing gadgets.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(true)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
                                >
                                    <Plus size={14} />
                                    <span>Add Address Now</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-extrabold text-sm text-slate-900">
                                                    {item.fullName}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAddress(index, item.fullName)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                                    title="Delete address"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                {item.addressLine}
                                            </p>
                                            <p className="text-xs font-semibold text-slate-500">
                                                {item.city}, {item.state} - {item.pincode}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                                <Phone size={12} className="text-teal-600" />
                                                <span>+91 {item.mobile}</span>
                                            </span>
                                            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                                                {item.country || 'India'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {/* ============================================================ */}
                {/* TAB CONTENT 3: ACCOUNT DETAILS                               */}
                {/* ============================================================ */}
                {activeTab === 'account' ? (
                    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
                        <div>
                            <h2 className="text-base font-black text-slate-900">Account Overview</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Your personal profile details registered on Swoo Tech Mart
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-slate-400 font-medium">Display Name</span>
                                <p className="font-extrabold text-sm text-slate-800">{user?.name || '—'}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-slate-400 font-medium">Email Address</span>
                                <p className="font-extrabold text-sm text-slate-800 break-all">{user?.email || '—'}</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-slate-400 font-medium">Account Role</span>
                                <p className="font-extrabold text-sm text-indigo-700 capitalize">
                                    {isAdmin ? 'Admin / Staff' : 'Customer Account'}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                <span className="text-slate-400 font-medium">Primary Contact</span>
                                <p className="font-extrabold text-sm text-slate-800">
                                    {addresses?.[0]?.mobile ? `+91 ${addresses[0].mobile}` : 'Add address to save phone'}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900 flex items-start gap-3">
                            <ShieldCheck size={18} className="text-teal-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <p className="font-extrabold">Data &amp; Privacy Protection</p>
                                <p className="text-teal-700 text-[11px] leading-relaxed">
                                    Your personal information and delivery addresses are encrypted. We never share your payment or phone records with third parties.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Sign Out from Swoo</span>
                            </button>
                        </div>
                    </div>
                ) : null}

            </div>
        </section>
    );
}
