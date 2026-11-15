'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useRazorpay } from 'react-razorpay';
import Link from 'next/link';
import {
    Loader2,
    MapPin,
    Plus,
    CreditCard,
    Truck,
    ShieldCheck,
    CheckCircle2,
    ShoppingBag,
    ArrowRight,
    Lock,
    X,
    Sparkles,
    AlertCircle,
    BadgeCheck,
} from 'lucide-react';
import { emptyCart, lsToCart } from '@/redux/features/cartSlice';
import { client, notify } from '@/utils/helper';
import { resolveMediaUrl } from '@/utils/media';

const CheckoutPage = () => {
    const cart = useSelector((store) => store.cart);
    const dispatch = useDispatch();
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [loading, setLoading] = useState(false);

    // Inline Add Address Modal
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        mobile: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: '',
        country: 'India',
    });

    const razorpayOpenRef = useRef(false);
    const { Razorpay } = useRazorpay();

    // ── Hydrate cart from localStorage on mount ──────────────────────────────
    useEffect(() => {
        dispatch(lsToCart());
    }, [dispatch]);

    // ── Fetch user ──────────────────────────────────────────────────────────
    useEffect(() => {
        client
            .get('/user/get')
            .then((res) => {
                if (res.data.success) {
                    setUser(res.data.user);
                    if (res.data.user?.name && !addressForm.fullName) {
                        setAddressForm((prev) => ({
                            ...prev,
                            fullName: res.data.user.name,
                        }));
                    }
                }
            })
            .catch(() => {
                router.push('/login');
            })
            .finally(() => setUserLoading(false));
    }, [router]);

    const addresses = user?.addresses || [];

    // Handle Inline Address Submission
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const { fullName, mobile, pincode, addressLine, city, state } = addressForm;
        if (!fullName || !mobile || !pincode || !addressLine || !city || !state) {
            notify('Please fill all required address fields', false);
            return;
        }

        setSavingAddress(true);
        try {
            const res = await client.post('/user/addAddress', addressForm);
            if (res.data.success) {
                const updatedAddresses = res.data.addresses || res.data.addAddress || [];
                setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
                setSelectedAddress(updatedAddresses.length - 1);
                setShowAddressModal(false);
                setAddressForm({
                    fullName: user?.name || '',
                    mobile: '',
                    pincode: '',
                    addressLine: '',
                    city: '',
                    state: '',
                    country: 'India',
                });
                notify('Delivery address saved successfully!', true);
            } else {
                notify(res.data.message || 'Failed to save address', false);
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Failed to save address', false);
        } finally {
            setSavingAddress(false);
        }
    };

    // ── Place Order ─────────────────────────────────────────────────────────
    const handleOrder = async () => {
        if (loading) return;

        if (!cart.items || cart.items.length === 0) {
            notify('Your cart is empty', false);
            return;
        }

        if (addresses.length === 0) {
            notify('Please add a delivery address first', false);
            setShowAddressModal(true);
            return;
        }

        const activeAddr = addresses[selectedAddress] || addresses[0];

        setLoading(true);

        try {
            await client.post('/cart/sync', {
                localCart: JSON.stringify(
                    cart.items.map((item) => ({ id: item._id || item.productId || item.id, qty: item.qty }))
                ),
                replace: true,
            });

            const response = await client.post('/order/create', {
                address: activeAddr,
                paymentMethod,
            });

            if (!response.data.success) {
                notify(response.data.message || 'Order creation failed', false);
                return;
            }

            // ── Cash On Delivery ───────────────────────────────────────────
            if (paymentMethod === 'cod') {
                dispatch(emptyCart());
                router.push(`/thank-you?orderId=${response.data.orderId}`);
                return;
            }

            // ── Online / Razorpay ─────────────────────────────────────────
            if (paymentMethod === 'online') {
                if (razorpayOpenRef.current) return;
                razorpayOpenRef.current = true;

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: response.data.amount,
                    currency: response.data.currency || 'INR',
                    name: 'Swoo Tech Mart',
                    description: 'Order Payment',
                    order_id: response.data.payment_order_Id,

                    handler: async (rzpResponse) => {
                        try {
                            const verifyRes = await client.post('/order/verify', {
                                razorpay_order_id: rzpResponse.razorpay_order_id,
                                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                                razorpay_signature: rzpResponse.razorpay_signature,
                            });

                            if (verifyRes.data.success) {
                                dispatch(emptyCart());
                                const verifiedOrderId =
                                    verifyRes.data.data?.orderId || verifyRes.data.orderId;
                                router.push(`/thank-you?orderId=${verifiedOrderId || ''}`);
                            } else {
                                notify(verifyRes.data.message || 'Payment verification failed', false);
                            }
                        } catch (err) {
                            notify('Payment verification error. Contact support.', false);
                            console.error('verifyPayment error:', err);
                        } finally {
                            razorpayOpenRef.current = false;
                            setLoading(false);
                        }
                    },

                    modal: {
                        ondismiss: () => {
                            razorpayOpenRef.current = false;
                            setLoading(false);
                            notify('Payment cancelled by user', false);
                        },
                    },

                    prefill: {
                        name: user?.name ?? '',
                        email: user?.email ?? '',
                        contact: activeAddr?.mobile ?? '',
                    },

                    theme: { color: '#0d9488' },
                };

                const rzpInstance = new Razorpay(options);

                rzpInstance.on('payment.failed', (failResponse) => {
                    razorpayOpenRef.current = false;
                    setLoading(false);
                    notify(`Payment failed: ${failResponse.error?.description || 'Unknown error'}`, false);
                });

                rzpInstance.open();
                return;
            }
        } catch (error) {
            const msg = error?.response?.data?.message || 'Something went wrong. Please try again.';
            notify(msg, false);
            console.error('handleOrder error:', error);
        } finally {
            if (paymentMethod !== 'online' || !razorpayOpenRef.current) {
                setLoading(false);
            }
        }
    };

    // ── Skeleton Loader ─────────────────────────────────────────────────────
    if (userLoading) {
        return (
            <div className="min-h-[60vh] bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center p-6 transition-colors">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={32} className="animate-spin text-teal-600 dark:text-teal-400" />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Preparing secure checkout...
                    </p>
                </div>
            </div>
        );
    }

    // ── Empty Cart State ────────────────────────────────────────────────────
    if (!cart.items || cart.items.length === 0) {
        return (
            <section className="min-h-[70vh] bg-slate-50 dark:bg-[#0b1120] flex items-center justify-center py-12 px-4 transition-colors">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-sm">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                        <ShoppingBag size={36} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Your Cart is Empty</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-8 leading-relaxed">
                        Looks like you haven&apos;t added any tech gadgets or accessories to your cart yet.
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition shadow-md hover:shadow-lg"
                    >
                        <span>Start Shopping</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        );
    }

    const originalTotal = Number(cart.original_total || 0);
    const finalTotal = Number(cart.final_total || 0);
    const savings = Math.max(0, originalTotal - finalTotal);

    return (
        <section className="bg-slate-50/60 dark:bg-[#0b1120] min-h-screen py-8 md:py-12 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header & Breadcrumb Tracker */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                                Checkout
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50">
                                <Lock size={11} />
                                <span>SSL Encrypted</span>
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            Complete your shipping details and select your payment method
                        </p>
                    </div>

                    {/* Step Tracker */}
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>1. Cart</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">→</span>
                        <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 text-white shadow-xs">
                            <span>2. Shipping &amp; Payment</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">→</span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                            <span>3. Done</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Shipping Address & Payment Selection */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">

                        {/* SECTION 1: DELIVERY ADDRESS */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs transition-colors">
                            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                                            Delivery Address
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Select where you want your order delivered
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(true)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 transition cursor-pointer"
                                >
                                    <Plus size={14} />
                                    <span>Add New Address</span>
                                </button>
                            </div>

                            {/* Address Cards Grid */}
                            {addresses.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-8 text-center space-y-3">
                                    <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                        <MapPin size={22} />
                                    </div>
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">No Delivery Address Found</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                        Please add your home or office address to proceed with the shipment.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddressModal(true)}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
                                    >
                                        <Plus size={14} />
                                        <span>Add Address Now</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr, index) => {
                                        const isSelected = selectedAddress === index;
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedAddress(index)}
                                                className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                                                    isSelected
                                                        ? 'border-teal-500 bg-teal-50/30 dark:bg-teal-950/30 shadow-xs'
                                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                                                }`}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                                                            {addr.fullName}
                                                        </span>
                                                        {isSelected ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">
                                                                <CheckCircle2 size={11} />
                                                                <span>Deliver Here</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[11px] font-semibold text-slate-400">
                                                                Select
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {addr.addressLine}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                                    <span>+91 {addr.mobile}</span>
                                                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                                                        {addr.country || 'India'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* SECTION 2: PAYMENT METHOD */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs transition-colors">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center shrink-0">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                                        Payment Method
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Choose how you would like to pay for your gadgets
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Cash on Delivery */}
                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                        paymentMethod === 'cod'
                                            ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                                                <Truck size={18} />
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'cod' ? 'border-teal-600 bg-teal-600' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                                            Cash on Delivery (COD)
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            Pay with cash or UPI on doorstep when package arrives.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                                        <span>No Extra Fee</span>
                                        <span>Pay on Delivery</span>
                                    </div>
                                </div>

                                {/* Online Payment (Razorpay) */}
                                <div
                                    onClick={() => setPaymentMethod('online')}
                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                                        paymentMethod === 'online'
                                            ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500/30'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                                                <CreditCard size={18} />
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'online' ? 'border-teal-600 bg-teal-600' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {paymentMethod === 'online' && <span className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </div>
                                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                                            Online Payment
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            Pay instantly via UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking.
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-teal-700 dark:text-teal-400 font-bold">
                                        <span>Instant Confirmation</span>
                                        <span>Razorpay Verified</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* SECTION 3: TRUST BADGES */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                    <Truck size={16} />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">Free Express Delivery</p>
                                    <p className="text-slate-400 text-[11px]">Orders over ₹199</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={16} />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">100% Genuine Tech</p>
                                    <p className="text-slate-400 text-[11px]">Brand warranty backed</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                    <BadgeCheck size={16} />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-slate-800 dark:text-slate-200">7-Day Replacement</p>
                                    <p className="text-slate-400 text-[11px]">Hassle-free guarantee</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">

                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                                        Order Summary
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                                    </p>
                                </div>
                                <Link
                                    href="/cart"
                                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline"
                                >
                                    Edit Cart
                                </Link>
                            </div>

                            {/* Cart Item Preview List */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-3">
                                {cart.items.map((item, idx) => {
                                    const thumbUrl = resolveMediaUrl('', item.thumbnail);
                                    return (
                                        <div key={idx} className="flex items-center gap-3 pt-3 first:pt-0">
                                            <div className="w-12 h-12 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                                {thumbUrl ? (
                                                    <img
                                                        src={thumbUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder.svg';
                                                        }}
                                                    />
                                                ) : (
                                                    <ShoppingBag size={18} className="text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Qty: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.qty}</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                                                    ₹{Number(item.final_price || item.price || 0).toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Price Calculation */}
                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">
                                        ₹{originalTotal.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {savings > 0 ? (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                                        <span>Total Savings / Discount</span>
                                        <span>-₹{savings.toLocaleString('en-IN')}</span>
                                    </div>
                                ) : null}

                                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium items-center">
                                    <span>Delivery Fee</span>
                                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                        <span className="line-through text-slate-400 font-normal">₹99</span>
                                        <span>FREE</span>
                                    </span>
                                </div>
                            </div>

                            {/* Total Payable Box */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950 text-white shadow-md border border-slate-700/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-black mt-0.5 text-white">
                                            ₹{finalTotal.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                                        {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}
                                    </span>
                                </div>
                            </div>

                            {/* Place Order CTA Button */}
                            <button
                                type="button"
                                disabled={loading || cart.items.length === 0 || addresses.length === 0}
                                onClick={handleOrder}
                                className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-extrabold text-sm md:text-base transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Processing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {paymentMethod === 'cod'
                                                ? 'Place Cash on Delivery Order'
                                                : `Pay ₹${finalTotal.toLocaleString('en-IN')} Now`}
                                        </span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                                <ShieldCheck size={13} className="text-teal-600 dark:text-teal-400" />
                                <span>256-Bit SSL Encrypted &amp; PCI-DSS Verified Checkout</span>
                            </p>
                        </div>

                    </div>

                </div>
            </div>

            {/* INLINE ADD ADDRESS MODAL */}
            {showAddressModal ? (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="font-black text-base text-slate-900 dark:text-slate-100">Add Delivery Address</h3>
                                    <p className="text-xs text-slate-400">Save address to deliver your order</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddressModal(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Receiver full name"
                                        value={addressForm.fullName}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="10-digit mobile"
                                        value={addressForm.mobile}
                                        onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    House / Flat / Street Address *
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="Enter complete building, street, landmark..."
                                    value={addressForm.addressLine}
                                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mumbai"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Maharashtra"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6 digits"
                                        value={addressForm.pincode}
                                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-slate-100 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingAddress}
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50 cursor-pointer"
                                >
                                    {savingAddress ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            <span>Saving Address...</span>
                                        </>
                                    ) : (
                                        <span>Save &amp; Deliver Here</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </section>
    );
};

export default CheckoutPage;
