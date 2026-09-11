'use client'

import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
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
            const response = await client.post('/user/login', {
                username: form.username.trim(),
                email: form.username.trim(),
                password: form.password,
            })

            if (!response.data?.success) {
                const msg = response.data?.message || 'Login failed'
                setError(msg)
                notify(msg, false)
                return
            }

            const role = response.data?.data?.role
            const token = response.data?.data?.token

            if (!['admin', 'superAdmin'].includes(role)) {
                const msg = 'Not an admin account'
                setError(msg)
                notify(msg, false)
                try {
                    await client.post('/user/logout')
                } catch (_) {}
                localStorage.removeItem('jwt')
                await clearAuthCookie()
                setStatus('login')
                return
            }

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
                    ? 'Server offline — start API: cd server && node --watch server.js'
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
            <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 text-gray-500">
                Loading...
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
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Login as Admin'}
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
        <div className="flex min-h-screen w-full bg-gray-50 overflow-x-hidden">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <Header onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
