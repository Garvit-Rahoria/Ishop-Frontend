'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useRazorpay } from 'react-razorpay';

import { client } from '@/utils/helper';

const CheckoutPage = ({ user }) => {

    const cart = useSelector((store) => store.cart);

    const router = useRouter();

    const addresses = user.addresses || [];

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [loading, setLoading] = useState(false);

    const { Razorpay } = useRazorpay();

    // Navigate to Profile Page
    const handleAddAddress = () => {
        router.push('/profile');
    };

    // Place Order
    const handleOrder = async () => {

        setLoading(true);

        const orderData = {
            address: addresses[selectedAddress],
            paymentMethod
        };

        try {

            const response = await client.post("/order/create", orderData);

            if (paymentMethod == 'cod') {

                if (response.data.success) {

                    router.push(`/thank-you?orderId=${response.data.orderId}`);

                }

            } else {

                console.log(response.data);

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    currency: "INR",
                    name: "Ishop Company",
                    description: "Test Transaction",
                    order_id: response.data.payment_order_Id,

                    handler: async (response) => {
                       try {
                        alert("Payment Successfully!")
                        const verifyResponse = await client.post("/order/verify",response)
                        console.log(verifyResponse)
                       } catch (error) {
                        console.log(error)
                       }

                    },

                    prefill: {
                        name: user.name ?? "John Doe",
                        email: user.email,
                        contact: "7976946314",
                    },

                    theme: {
                        color: "#F37254",
                    },
                };

                const razorpayInstance = new Razorpay(options);

                razorpayInstance.open();
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    return (
        <section className="bg-white py-10">

            <div className="max-w-7xl mx-auto px-4">

                <h1 className="text-lg font-semibold mb-6">
                    CHECKOUT
                </h1>

                {/* Notices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                    <div className="bg-gray-100 rounded-md p-4 text-sm">
                        Returning customer?{" "}
                        <span className="text-red-500 cursor-pointer">
                            Click here to log in
                        </span>
                    </div>

                    <div className="bg-gray-100 rounded-md p-4 text-sm">
                        Have a coupon?{" "}
                        <span className="text-red-500 cursor-pointer">
                            Click here to enter your code
                        </span>
                    </div>

                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT */}
                    <div className="lg:col-span-8">

                        <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">

                            <div className="xl:col-span-2 space-y-8">

                                {/* ADDRESS SECTION */}
                                <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-8">

                                    {/* Header */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                                        <div>

                                            <h2 className="text-3xl font-bold text-gray-800">
                                                Delivery Address
                                            </h2>

                                            <p className="text-gray-500 mt-1">
                                                Select your preferred delivery location
                                            </p>

                                        </div>

                                        <button
                                            onClick={handleAddAddress}
                                            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:scale-105 hover:shadow-xl transition-all duration-300 text-white px-5 py-3 rounded-2xl font-semibold"
                                        >
                                            + Add New Address
                                        </button>

                                    </div>

                                    {/* Address Cards */}
                                    <div className="grid grid-cols-1 gap-5">

                                        {
                                            addresses.map((addr, index) => (

                                                <div
                                                    key={index}
                                                    onClick={() => setSelectedAddress(index)}
                                                    className={`group relative overflow-hidden border-2 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                                                    
                                                    ${selectedAddress === index
                                                            ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50 shadow-xl'
                                                            : 'border-gray-200 bg-white hover:border-teal-300'
                                                        }
                                                `}
                                                >

                                                    {/* Selected Badge */}
                                                    {
                                                        selectedAddress === index && (
                                                            <div className="absolute bottom-4 right-4 bg-teal-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                                                Selected
                                                            </div>
                                                        )
                                                    }

                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                                        {/* Left */}
                                                        <div className="space-y-3">

                                                            <div>

                                                                <h3 className="text-xl font-bold text-gray-800">
                                                                    {addr.fullName}
                                                                </h3>

                                                                <p className="text-sm text-gray-500">
                                                                    Home Address
                                                                </p>

                                                            </div>

                                                            <div className="space-y-1">

                                                                <p className="text-gray-700 leading-relaxed">
                                                                    {addr.addressLine}
                                                                </p>

                                                                <p className="text-gray-600">
                                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                                </p>

                                                            </div>

                                                        </div>

                                                        {/* Right */}
                                                        <div className="flex flex-col items-start md:items-end gap-3">

                                                            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium">
                                                                +91 {addr.mobile}
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                </div>

                                {/* PAYMENT SECTION */}
                                <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-8">

                                    {/* Header */}
                                    <div className="mb-8">

                                        <h2 className="text-3xl font-bold text-gray-800">
                                            Payment Method
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Choose your preferred payment option
                                        </p>

                                    </div>

                                    {/* Payment Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                        {/* COD */}
                                        <label
                                            className={`cursor-pointer border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                                            
                                            ${paymentMethod === 'cod'
                                                    ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50'
                                                    : 'border-gray-200 bg-white hover:border-teal-300'
                                                }
                                        `}
                                        >

                                            <div className="flex items-start gap-4">

                                                <input
                                                    type="radio"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={() => setPaymentMethod('cod')}
                                                    className="mt-1 w-5 h-5 accent-teal-500"
                                                />

                                                <div>

                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        Cash on Delivery
                                                    </h3>

                                                    <p className="text-gray-500 mt-2 leading-relaxed">
                                                        Pay easily when your order arrives at your doorstep.
                                                    </p>

                                                </div>

                                            </div>

                                        </label>

                                        {/* ONLINE */}
                                        <label
                                            className={`cursor-pointer border-2 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                                            
                                            ${paymentMethod === 'online'
                                                    ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-emerald-50'
                                                    : 'border-gray-200 bg-white hover:border-teal-300'
                                                }
                                        `}
                                        >

                                            <div className="flex items-start gap-4">

                                                <input
                                                    type="radio"
                                                    checked={paymentMethod === 'online'}
                                                    onChange={() => setPaymentMethod('online')}
                                                    className="mt-1 w-5 h-5 accent-teal-500"
                                                />

                                                <div>

                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        Online Payment
                                                    </h3>

                                                    <p className="text-gray-500 mt-2 leading-relaxed">
                                                        Pay securely using UPI, Debit Card, Credit Card or Net Banking.
                                                    </p>

                                                </div>

                                            </div>

                                        </label>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-4">

                        <div className="sticky top-6">

                            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 md:p-7 h-fit">

                                {/* Glow Effects */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/40 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-100/30 rounded-full blur-3xl"></div>

                                {/* Header */}
                                <div className="relative flex items-center justify-between mb-6">

                                    <div>

                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Order Summary
                                        </h2>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Review your final payment details
                                        </p>

                                    </div>

                                    <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                                        Secure
                                    </div>

                                </div>

                                {/* Divider */}
                                <div className="relative border-t border-gray-200 mb-5"></div>

                                {/* Pricing */}
                                <div className="relative space-y-4">

                                    {/* Original Total */}
                                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">

                                        <div>

                                            <p className="text-sm font-medium text-gray-500">
                                                Original Total
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                Before discounts
                                            </p>

                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800">
                                            ₹{cart.original_total}
                                        </h3>

                                    </div>

                                    {/* Savings */}
                                    <div className="flex items-center justify-between bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100">

                                        <div>

                                            <p className="text-sm font-medium text-emerald-700">
                                                Total Savings
                                            </p>

                                            <p className="text-xs text-emerald-500 mt-1">
                                                Discount applied
                                            </p>

                                        </div>

                                        <h3 className="text-lg font-bold text-emerald-600">
                                            ₹{cart.original_total - cart.final_total}
                                        </h3>

                                    </div>

                                </div>

                                {/* Divider */}
                                <div className="relative border-t border-dashed border-gray-300 my-6"></div>

                                {/* Final Total */}
                                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-5 text-white shadow-xl">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-sm text-gray-300">
                                                Final Amount
                                            </p>

                                            <h2 className="text-3xl font-bold mt-1">
                                                ₹{cart.final_total}
                                            </h2>

                                        </div>

                                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-semibold">
                                            Total
                                        </div>

                                    </div>

                                </div>

                                {/* Order Button */}
                                <button
                                    disabled={loading}
                                    onClick={handleOrder}
                                    className="group relative overflow-hidden w-full mt-7 bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white py-4 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    <span className="relative z-10">
                                        {loading ? 'Placing Order...' : 'Order Now'}
                                    </span>

                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                                </button>

                                {/* Bottom Text */}
                                <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                                    Safe & secure payments powered by encrypted checkout
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default CheckoutPage;