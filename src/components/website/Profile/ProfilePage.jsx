'use client'

import { client, notify } from "@/utils/helper";
import { useState, useEffect } from "react";
import {
    FiMail,
    FiPhone,
} from "react-icons/fi";
import Link from "next/link";
import { resolveMediaUrl } from "@/utils/media";

const ProfilePage = ({ user }) => {

    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const emptyForm = {
        fullName: '',
        mobile: '',
        pincode: '',
        addressLine: '',
        city: '',
        state: '',
        country: 'India',
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        setAddresses(Array.isArray(user?.addresses) ? user.addresses : []);
    }, [user]);

    useEffect(() => {
        let cancelled = false;
        setOrdersLoading(true);
        client
            .get("/order/my")
            .then((res) => {
                if (!cancelled) {
                    setOrders(Array.isArray(res.data?.data) ? res.data.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) setOrders([]);
            })
            .finally(() => {
                if (!cancelled) setOrdersLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const payload = {
            ...form,
            country: form.country?.trim() || "India",
        };

        client.post('/user/addAddress', payload)
            .then((res) => {
                const next = res.data?.addresses || res.data?.addAddress || [];
                setAddresses(Array.isArray(next) ? next : []);
                setForm(emptyForm);
                notify(res.data?.message || "Address saved", true);
            })
            .catch((err) => {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to add address";
                setError(message);
                notify(message, false);
            })
            .finally(() => setLoading(false));
    };
    return (
        <section className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Top Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-4">

                        <div className="bg-white border border-gray-100 shadow-2xl rounded-[32px] overflow-hidden sticky top-24">

                            {/* Top Banner */}
                            <div className="relative h-32 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500">

                                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>

                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
                            </div>

                            {/* Profile Content */}
                            <div className="relative px-6 pb-8">

                                {/* Profile Image */}
                                <div className="flex justify-center">

                                    <div className="-mt-16 relative">

                                        <div className="w-32 h-32 rounded-3xl overflow-hidden border-[6px] border-white shadow-2xl bg-teal-50 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-teal-600">
                                                {(user?.name || "U").charAt(0).toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Online Dot */}
                                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center mt-5">

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {user?.name || "User"}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1 capitalize">
                                        {user?.role === "admin" || user?.role === "superAdmin"
                                            ? "Admin account"
                                            : "Customer"}
                                    </p>
                                </div>

                                {/* User Details */}
                                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                                            <FiMail size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Email
                                            </p>

                                            <p className="text-sm font-medium text-gray-700 break-all">
                                                {user?.email || "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <FiPhone size={18} />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Phone
                                            </p>

                                            <p className="text-sm font-medium text-gray-700">
                                                {addresses?.[0]?.mobile
                                                    ? `+91 ${addresses[0].mobile}`
                                                    : "Add an address to save phone"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="lg:col-span-8">

                        {/* Empty Space For Cards */}
                        {/* <div className="bg-white border border-dashed border-gray-200 rounded-3xl min-h-[420px] p-6">

                            <h2 className="text-2xl font-bold text-gray-700 mb-6">
                                Saved Addresses
                            </h2>

                            {
                                addresses.length === 0 ? (
                                    <div className="h-[250px] flex items-center justify-center">

                                        <div className="text-center">
                                            <p className="text-gray-400">
                                                Future me yaha address cards show honge
                                            </p>
                                        </div>

                                    </div>
                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {
                                            addresses.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-200 rounded-2xl p-5 shadow-sm"
                                                >
                                                    <h3 className="text-lg font-bold text-gray-800">
                                                        {item.fullName}
                                                    </h3>

                                                    <p className="text-gray-600 mt-2">
                                                        {item.addressLine}
                                                    </p>

                                                    <p className="text-gray-500 mt-2">
                                                        {item.city}, {item.state}
                                                    </p>

                                                    <p className="text-gray-500">
                                                        {item.pincode}
                                                    </p>

                                                    <p className="text-gray-700 mt-3 font-medium">
                                                        {item.mobile}
                                                    </p>
                                                </div>
                                            ))
                                        }

                                    </div>
                                )
                            }

                        </div> */}
                        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] min-h-[420px] p-6 md:p-8">

                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">
                                        Saved Addresses
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Manage all your saved delivery addresses
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2 rounded-2xl shadow-lg text-sm font-semibold">
                                    {addresses.length} Address
                                </div>

                            </div>

                            {
                                addresses.length === 0 ? (

                                    <div className="h-[280px] flex items-center justify-center">

                                        <div className="text-center">

                                            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-10 h-10 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0L6.343 16.657A8 8 0 1117.657 16.657z"
                                                    />

                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>

                                            </div>

                                            <h3 className="text-xl font-bold text-gray-700">
                                                No Address Found
                                            </h3>

                                            <p className="text-gray-400 mt-2">
                                                Add your delivery address to continue shopping
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {
                                            addresses.map((item, index) => (

                                                <div
                                                    key={index}
                                                    className="group relative overflow-hidden border-2 border-gray-200 bg-white rounded-[28px] p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-teal-400"
                                                >

                                                    {/* Glow */}
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/30 rounded-full blur-3xl"></div>

                                                    {/* Top */}
                                                    <div className="relative flex items-start justify-between gap-4">

                                                        <div>

                                                            <h3 className="text-2xl font-bold text-gray-800">
                                                                {item.fullName}
                                                            </h3>

                                                            <p className="text-sm text-teal-600 font-medium mt-1">
                                                                Delivery Address
                                                            </p>

                                                        </div>

                                                        <div className="bg-teal-50 text-teal-600 text-xs font-semibold px-3 py-1 rounded-full">
                                                            Active
                                                        </div>

                                                    </div>

                                                    {/* Address */}
                                                    <div className="relative mt-6 space-y-3">

                                                        <div className="flex gap-3">

                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">

                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="w-5 h-5 text-gray-500"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.8}
                                                                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0L6.343 16.657A8 8 0 1117.657 16.657z"
                                                                    />

                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.8}
                                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                                    />
                                                                </svg>

                                                            </div>

                                                            <div>

                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {item.addressLine}
                                                                </p>

                                                                <p className="text-gray-500 mt-1">
                                                                    {item.city}, {item.state}
                                                                </p>

                                                                <p className="text-gray-500">
                                                                    {item.pincode}
                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* Mobile */}
                                                        <div className="flex items-center gap-3 pt-2">

                                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">

                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="w-5 h-5 text-emerald-600"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={1.8}
                                                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                                    />
                                                                </svg>

                                                            </div>

                                                            <p className="text-gray-700 font-semibold">
                                                                +91 {item.mobile}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* Address is managed via Add Address form below */}
                                                    <p className="relative mt-6 text-xs text-gray-400">
                                                        To update, add a new delivery address below.
                                                    </p>

                                                </div>
                                            ))
                                        }

                                    </div>
                                )
                            }

                        </div>

                    </div>

                </div>

                {/* My Orders */}
                <div className="mt-10 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                        <Link href="/products" className="text-sm text-teal-600 hover:underline">
                            Continue shopping
                        </Link>
                    </div>
                    {ordersLoading ? (
                        <p className="text-sm text-gray-500 py-8 text-center">Loading orders…</p>
                    ) : orders.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
                            <p className="text-gray-700 font-medium">No orders yet</p>
                            <p className="text-sm text-gray-500 mt-1">Your placed orders will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50/80 transition"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-400">Order ID</p>
                                            <p className="font-mono text-sm font-semibold text-gray-800 break-all">
                                                {order._id}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 capitalize">
                                                {order.orderStatus || order.paymentStatus || "placed"}
                                            </span>
                                            <p className="text-sm font-bold text-gray-800 mt-1">
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {(order.items || []).slice(0, 4).map((item, idx) => {
                                            const p = item.product_id;
                                            const thumb = resolveMediaUrl("", p?.thumbnail);
                                            return (
                                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                                    {thumb ? (
                                                        <img
                                                            src={thumb}
                                                            alt=""
                                                            className="w-10 h-10 object-contain rounded border bg-white"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/placeholder.svg";
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span>
                                                        {p?.name || "Product"} × {item.qty}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleString("en-IN")
                                            : ""}
                                        {order.paymentMethod ? ` · ${String(order.paymentMethod).toUpperCase()}` : ""}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div className="mt-10">

                    <div className="max-w-5xl">

                        <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-10">

                            {/* Glow Effects */}
                            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl"></div>

                            {/* Header */}
                            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

                                <div>

                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        Account Information
                                    </h2>

                                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                                        Manage your personal and delivery details easily
                                    </p>

                                </div>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="relative space-y-7"
                            >

                                {/* Full Name */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter your full name"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                        />

                                    </div>

                                </div>

                                {/* Mobile */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Mobile Number
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Enter mobile number"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                        />

                                    </div>

                                </div>

                                {/* Address */}
                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Full Address
                                    </label>

                                    <textarea
                                        name="addressLine"
                                        rows="5"
                                        placeholder="Enter your complete delivery address"
                                        value={form.addressLine}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none"
                                    ></textarea>

                                </div>

                                {/* City State Pincode */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                                    {/* City */}
                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                        />

                                    </div>

                                    {/* State */}
                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            placeholder="Enter state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                        />

                                    </div>

                                    {/* Pincode */}
                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            placeholder="Enter pincode"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                        />

                                    </div>

                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Enter country"
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                                    />
                                </div>

                                {error ? (
                                    <p className="text-red-500 text-sm font-medium">{error}</p>
                                ) : null}

                                {/* Button */}
                                <div className="pt-4">

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white px-10 py-4 rounded-2xl font-bold text-sm md:text-base disabled:opacity-60"
                                    >

                                        <span className="relative z-10">
                                            {loading ? "Saving..." : "Save Address"}
                                        </span>

                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default ProfilePage;