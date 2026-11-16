'use client'

import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Loader2 } from 'lucide-react'
import Header from '@/components/admin/Header'
import Sidebar from '@/components/admin/Sidebar'
import { client, notify } from '@/utils/helper'
import { mirrorAuthCookie, clearAuthCookie } from '@/utils/authCookie'

export default function AdminShell({ children }) {
    const [status, setStatus] = useState('loading') // loading | login | ready
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [mobileOpen, setMobileOpen] = useState(false)
    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    const checkAdmin = async () => {
        // The admin session is established by the client login flow. If the
        // local token is gone, always show the login screen even when an old
        // API cookie could not be cleared because of a network/CORS failure.
        if (!localStorage.getItem('jwt')) {
            setStatus('login')
            return
        }

        try {
            const res = await client.get('/user/get')
            const user = res.data?.user
            const role = user?.role
            if (res.data?.success && user && ['admin', 'superAdmin'].includes(role)) {
                setStatus('ready')
                return
            }
        } catch (_) {}
        setStatus('login')
    }

    useEffect(() => {
        checkAdmin()
    }, [])

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const rawUsername = form.username.trim()
            // Map "admin" or "Admin" to the database admin email
            const emailToSend = rawUsername.toLowerCase() === 'admin' ? 'admin@swoo.com' : rawUsername

            const response = await client.post('/user/login', {
                username: rawUsername,
                email: emailToSend,
                password: form.password,
            })

            if (!response.data?.success) {
                const msg = response.data?.message || 'Login failed'
                setError(msg)
                notify(msg, false)
                return
            }

            const token = response.data?.data?.token
            if (!token) {
                const msg = 'Login succeeded but no token returned'
                setError(msg)
                notify(msg, false)
                return
            }

            localStorage.setItem('jwt', token)
            await mirrorAuthCookie(token)

            notify('Admin login successful', true)
            // Full reload so SSR dashboard gets the jwt cookie
            window.location.assign('/admin')
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                (err?.code === 'ERR_NETWORK' || !err?.response
                    ? 'Backend Server offline hai — Ishop-Backend start karein: cd Ishop-Backend && npm start'
                    : err?.message || 'Login failed')
            setError(msg)
            notify(msg, false)
            setStatus('login')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white select-none">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 text-white font-black text-2xl shadow-xl shadow-teal-500/25 mb-4 animate-pulse">
                    S
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-300">
                    <Loader2 size={16} className="animate-spin text-teal-400" />
                    <span>Loading Admin Workspace...</span>
                </div>
            </div>
        )
    }

    if (status === 'login') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-14 h-14 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-black mb-4">
                            S
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Sign in to open the admin dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Admin"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="admin123"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                {error}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-xl transition duration-150 shadow-md shadow-teal-500/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-white" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Login as Admin</span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        Use an admin account to access the dashboard
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full bg-slate-50/60 overflow-x-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMenuClick={() => setMobileOpen(true)}
                    onLoggedOut={() => setStatus('login')}
                />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
