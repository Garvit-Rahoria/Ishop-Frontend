'use client'

import { useState } from 'react'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import { client, notify } from '@/utils/helper'

const INITIAL = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'India',
    subject: '',
    message: '',
    newsletter: false,
}

const fieldClass =
    'w-full rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20'
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

const ContactForm = () => {
    const [form, setForm] = useState(INITIAL)
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSent(false)
        try {
            const res = await client.post('/contact', form)
            if (!res.data?.success) {
                notify(res.data?.message || 'Failed to send message', false)
                return
            }
            notify(
                res.data.message ||
                    'Message sent successfully! Check your email for confirmation.',
                true
            )
            setForm(INITIAL)
            setSent(true)
        } catch (err) {
            notify(
                err?.response?.data?.message ||
                    (err?.code === 'ERR_NETWORK'
                        ? 'Server offline — start API on port 5000'
                        : 'Failed to send message. Please try again.'),
                false
            )
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="rounded-2xl bg-teal-50 border border-teal-100 px-6 py-12 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center mb-4">
                    <FiCheckCircle size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Message sent</h3>
                <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
                    Thanks for reaching out. A confirmation email is on its way —
                    we&apos;ll reply to your inbox soon.
                </p>
                <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm font-semibold text-teal-700 hover:text-teal-800 underline-offset-2 hover:underline"
                >
                    Send another message
                </button>
            </div>
        )
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className={labelClass}>
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="Enter your first name"
                        className={fieldClass}
                        value={form.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className={labelClass}>
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder="Enter your last name"
                        className={fieldClass}
                        value={form.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="example@gmail.com"
                        className={fieldClass}
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="phone" className={labelClass}>
                        Phone Number{' '}
                        <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        className={fieldClass}
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="country" className={labelClass}>
                        Country <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="country"
                        name="country"
                        required
                        className={fieldClass}
                        value={form.country}
                        onChange={handleChange}
                    >
                        <option value="India">India</option>
                        <option value="United States (US)">United States (US)</option>
                        <option value="United Kingdom (UK)">United Kingdom (UK)</option>
                        <option value="United Arab Emirates (UAE)">
                            United Arab Emirates (UAE)
                        </option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="subject" className={labelClass}>
                        Subject{' '}
                        <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Order help, product question…"
                        className={fieldClass}
                        value={form.subject}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="message" className={labelClass}>
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className={`${fieldClass} min-h-[140px] resize-y`}
                    value={form.message}
                    onChange={handleChange}
                />
            </div>

            <label
                htmlFor="newsletter"
                className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
            >
                <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    className="mt-0.5 accent-teal-600"
                    checked={form.newsletter}
                    onChange={handleChange}
                />
                <span>
                    Send me occasional news and deals. By submitting, I agree to the{' '}
                    <span className="text-teal-600 font-medium">Terms &amp; Conditions</span>.
                </span>
            </label>

            <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px] bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-semibold disabled:opacity-60 transition shadow-sm hover:shadow-md"
            >
                <FiSend
                    size={16}
                    className={`transition ${loading ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
                />
                {loading ? 'Sending…' : 'Send Message'}
            </button>
        </form>
    )
}

export default ContactForm
