'use client'

import { useCallback, useEffect, useState } from 'react'
import { FiMail, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import { client, notify } from '@/utils/helper'

function formatDate(value) {
    if (!value) return '-'
    try {
        return new Date(value).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return '-'
    }
}

export default function MessagesPage() {
    const [status, setStatus] = useState('all') // all | unread | read
    const [messages, setMessages] = useState([])
    const [meta, setMeta] = useState({ unreadCount: 0, readCount: 0, total: 0 })
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(true)

    const load = useCallback(async (filter = status) => {
        setLoading(true)
        try {
            const res = await client.get(`/contact/messages?status=${filter}`)
            if (!res.data?.success) {
                notify(res.data?.message || 'Failed to load', false)
                return
            }
            setMessages(res.data.data || [])
            setMeta(res.data.meta || { unreadCount: 0, readCount: 0, total: 0 })
        } catch (err) {
            notify(err?.response?.data?.message || 'Failed to load messages', false)
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        load(status)
    }, [status, load])

    const openMessage = async (msg) => {
        setSelected(msg)
        if (!msg.isRead) {
            try {
                await client.patch(`/contact/messages/${msg._id}/read`)
                setMessages((prev) =>
                    prev.map((m) =>
                        m._id === msg._id ? { ...m, isRead: true, readAt: new Date().toISOString() } : m
                    )
                )
                setSelected((s) => (s ? { ...s, isRead: true } : s))
                setMeta((m) => ({
                    ...m,
                    unreadCount: Math.max(0, (m.unreadCount || 0) - 1),
                    readCount: (m.readCount || 0) + 1,
                }))
            } catch (_) {}
        }
    }

    const toggleRead = async (msg, e) => {
        e?.stopPropagation()
        const nextRead = !msg.isRead
        try {
            await client.patch(
                `/contact/messages/${msg._id}/${nextRead ? 'read' : 'unread'}`
            )
            notify(nextRead ? 'Marked as read' : 'Marked as unread', true)
            if (status !== 'all') {
                await load(status)
                if (selected?._id === msg._id) setSelected(null)
            } else {
                setMessages((prev) =>
                    prev.map((m) =>
                        m._id === msg._id
                            ? {
                                  ...m,
                                  isRead: nextRead,
                                  readAt: nextRead ? new Date().toISOString() : null,
                              }
                            : m
                    )
                )
                setMeta((m) => ({
                    ...m,
                    unreadCount: nextRead
                        ? Math.max(0, m.unreadCount - 1)
                        : m.unreadCount + 1,
                    readCount: nextRead ? m.readCount + 1 : Math.max(0, m.readCount - 1),
                }))
                if (selected?._id === msg._id) {
                    setSelected((s) =>
                        s ? { ...s, isRead: nextRead } : s
                    )
                }
            }
        } catch (err) {
            notify(err?.response?.data?.message || 'Update failed', false)
        }
    }

    const remove = async (msg, e) => {
        e?.stopPropagation()
        if (!confirm('Delete this message?')) return
        try {
            await client.delete(`/contact/messages/${msg._id}`)
            notify('Message deleted', true)
            if (selected?._id === msg._id) setSelected(null)
            await load(status)
        } catch (err) {
            notify(err?.response?.data?.message || 'Delete failed', false)
        }
    }

    const tabs = [
        { id: 'all', label: 'All', count: meta.total },
        { id: 'unread', label: 'Unread', count: meta.unreadCount },
        { id: 'read', label: 'Read', count: meta.readCount },
    ]

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Contact form messages from the website
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => load(status)}
                    className="inline-flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                    <FiRefreshCw size={14} />
                    Refresh
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                            setStatus(tab.id)
                            setSelected(null)
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                            status === tab.id
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-gray-700 border hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                        <span
                            className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                                status === tab.id
                                    ? 'bg-white/20'
                                    : tab.id === 'unread'
                                      ? 'bg-teal-100 text-teal-700'
                                      : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {tab.count ?? 0}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                {/* List */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
                    {loading ? (
                        <p className="p-8 text-center text-gray-400 text-sm">Loading…</p>
                    ) : messages.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">
                            <FiMail className="mx-auto mb-2" size={28} />
                            <p className="text-sm">No messages here</p>
                        </div>
                    ) : (
                        <ul className="divide-y max-h-[70vh] overflow-y-auto">
                            {messages.map((msg) => {
                                const active = selected?._id === msg._id
                                return (
                                    <li key={msg._id}>
                                        <button
                                            type="button"
                                            onClick={() => openMessage(msg)}
                                            className={`w-full text-left px-4 py-3.5 transition ${
                                                active
                                                    ? 'bg-teal-50'
                                                    : msg.isRead
                                                      ? 'hover:bg-gray-50'
                                                      : 'bg-amber-50/60 hover:bg-amber-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-sm truncate ${
                                                            msg.isRead
                                                                ? 'font-medium text-gray-800'
                                                                : 'font-bold text-gray-900'
                                                        }`}
                                                    >
                                                        {msg.firstName} {msg.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                        {msg.subject || '(No subject)'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 truncate">
                                                        {msg.email}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    {!msg.isRead && (
                                                        <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mb-1" />
                                                    )}
                                                    <p className="text-[10px] text-gray-400">
                                                        {formatDate(msg.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>

                {/* Detail */}
                <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border p-5 md:p-6 min-h-[320px]">
                    {!selected ? (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm py-20">
                            Select a message to read
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {selected.subject || '(No subject)'}
                                        </h2>
                                        <span
                                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                selected.isRead
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-teal-100 text-teal-700'
                                            }`}
                                        >
                                            {selected.isRead ? 'Read' : 'Unread'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        From{' '}
                                        <span className="font-semibold">
                                            {selected.firstName} {selected.lastName}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDate(selected.createdAt)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={(e) => toggleRead(selected, e)}
                                        className="text-xs font-semibold px-3 py-2 rounded-lg border hover:bg-gray-50"
                                    >
                                        Mark {selected.isRead ? 'unread' : 'read'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => remove(selected, e)}
                                        className="text-xs font-semibold px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                                    >
                                        <FiTrash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-5">
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-[11px] uppercase text-gray-400 font-semibold">
                                        Email
                                    </p>
                                    <a
                                        href={`mailto:${selected.email}`}
                                        className="text-teal-700 font-medium break-all"
                                    >
                                        {selected.email}
                                    </a>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-[11px] uppercase text-gray-400 font-semibold">
                                        Phone
                                    </p>
                                    <p className="font-medium">{selected.phone || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-[11px] uppercase text-gray-400 font-semibold">
                                        Country
                                    </p>
                                    <p className="font-medium">{selected.country || '—'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-[11px] uppercase text-gray-400 font-semibold">
                                        Newsletter
                                    </p>
                                    <p className="font-medium">
                                        {selected.newsletter ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] uppercase text-gray-400 font-semibold mb-2">
                                    Message
                                </p>
                                <div className="rounded-xl border bg-slate-50 p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {selected.message}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
