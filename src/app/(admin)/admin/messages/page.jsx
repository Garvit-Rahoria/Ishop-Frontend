"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Mail,
  Trash2,
  RotateCw,
  Search,
  Phone,
  Globe,
  Send,
  CheckCircle,
  Inbox,
  User,
  X,
} from "lucide-react";
import { client, notify } from "@/utils/helper";
import Swal from "sweetalert2";
import { formatDate, formatTimeAgo } from "@/utils/adminFormatters";

export default function MessagesPage() {
  const [status, setStatus] = useState("all"); // all | unread | read
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState({ unreadCount: 0, readCount: 0, total: 0 });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(
    async (filter = status) => {
      setLoading(true);
      try {
        const res = await client.get(`/contact/messages?status=${filter}`);
        if (!res.data?.success) {
          notify(res.data?.message || "Failed to load messages", false);
          return;
        }
        setMessages(res.data.data || []);
        setMeta(res.data.meta || { unreadCount: 0, readCount: 0, total: 0 });
      } catch (err) {
        notify(
          err?.response?.data?.message || "Failed to load messages",
          false
        );
      } finally {
        setLoading(false);
      }
    },
    [status]
  );

  useEffect(() => {
    load(status);
  }, [status, load]);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await client.patch(`/contact/messages/${msg._id}/read`);
        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id
              ? { ...m, isRead: true, readAt: new Date().toISOString() }
              : m
          )
        );
        setSelected((s) => (s ? { ...s, isRead: true } : s));
        setMeta((m) => ({
          ...m,
          unreadCount: Math.max(0, (m.unreadCount || 0) - 1),
          readCount: (m.readCount || 0) + 1,
        }));
      } catch (_) {}
    }
  };

  const toggleRead = async (msg, e) => {
    e?.stopPropagation();
    const nextRead = !msg.isRead;
    try {
      await client.patch(
        `/contact/messages/${msg._id}/${nextRead ? "read" : "unread"}`
      );
      notify(nextRead ? "Marked as read" : "Marked as unread", true);
      if (status !== "all") {
        await load(status);
        if (selected?._id === msg._id) setSelected(null);
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
        );
        setMeta((m) => ({
          ...m,
          unreadCount: nextRead
            ? Math.max(0, m.unreadCount - 1)
            : m.unreadCount + 1,
          readCount: nextRead ? m.readCount + 1 : Math.max(0, m.readCount - 1),
        }));
        if (selected?._id === msg._id) {
          setSelected((s) => (s ? { ...s, isRead: nextRead } : s));
        }
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Update failed", false);
    }
  };

  const remove = async (msg, e) => {
    e?.stopPropagation();

    const result = await Swal.fire({
      title: "Delete message?",
      text: "This customer inquiry will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(`/contact/messages/${msg._id}`);
      notify("Message deleted successfully", true);
      if (selected?._id === msg._id) setSelected(null);
      await load(status);
    } catch (err) {
      notify(err?.response?.data?.message || "Delete failed", false);
    }
  };

  const filteredMessages = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter((m) => {
      const name = `${m.firstName} ${m.lastName}`.toLowerCase();
      const email = String(m.email || "").toLowerCase();
      const subject = String(m.subject || "").toLowerCase();
      const msg = String(m.message || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        subject.includes(q) ||
        msg.includes(q)
      );
    });
  }, [messages, search]);

  const tabs = [
    { id: "all", label: "All Inquiries", count: meta.total },
    { id: "unread", label: "Unread", count: meta.unreadCount },
    { id: "read", label: "Read", count: meta.readCount },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Customer Inquiries
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {meta.unreadCount || 0} Unread
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Read, respond to, and archive contact form submissions from the store.
          </p>
        </div>

        <button
          type="button"
          onClick={() => load(status)}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs transition cursor-pointer"
        >
          <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl w-fit">
          {tabs.map((tab) => {
            const active = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatus(tab.id);
                  setSelected(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    active
                      ? tab.id === "unread" && tab.count > 0
                        ? "bg-teal-500 text-white"
                        : "bg-slate-100 text-slate-700"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  {tab.count ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Inbox Split View Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        {/* Left Side: Message List */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-2xs border border-slate-200/90 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Conversations</span>
            <span>{filteredMessages.length} Messages</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <RotateCw size={24} className="animate-spin mx-auto mb-2 text-slate-300" />
              <p>Loading inquiries...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Inbox size={36} className="mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">No messages found</p>
              <p className="text-slate-400 mt-0.5">Your customer inbox is clear.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto">
              {filteredMessages.map((msg) => {
                const active = selected?._id === msg._id;
                const fullName = `${msg.firstName || ""} ${msg.lastName || ""}`.trim() || "Visitor";
                const initials = fullName.slice(0, 2).toUpperCase();

                return (
                  <li key={msg._id}>
                    <button
                      type="button"
                      onClick={() => openMessage(msg)}
                      className={`w-full text-left p-4 transition flex items-start gap-3 cursor-pointer ${
                        active
                          ? "bg-teal-50/70 border-l-4 border-teal-500"
                          : msg.isRead
                          ? "hover:bg-slate-50/80 bg-white"
                          : "bg-amber-50/40 hover:bg-amber-50/70 border-l-4 border-amber-400"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`text-xs truncate ${
                              msg.isRead
                                ? "font-semibold text-slate-700"
                                : "font-black text-slate-900"
                            }`}
                          >
                            {fullName}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatTimeAgo(msg.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {msg.subject || "(No subject)"}
                        </p>

                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {msg.message}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right Side: Message Detail */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-2xs border border-slate-200/90 p-6 min-h-[450px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-24">
              <Mail size={44} className="text-slate-300 mb-3 stroke-[1.5]" />
              <p className="font-semibold text-slate-700 text-sm">
                No message selected
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Select an inquiry from the left pane to view details and customer message.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        selected.isRead
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-teal-50 text-teal-700 border-teal-200"
                      }`}
                    >
                      {selected.isRead ? "Read" : "Unread"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatDate(selected.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {selected.subject || "(No subject)"}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    From{" "}
                    <strong className="text-slate-800">
                      {selected.firstName} {selected.lastName}
                    </strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleRead(selected, e)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
                  >
                    Mark {selected.isRead ? "Unread" : "Read"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => remove(selected, e)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Mail size={11} /> Email
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-xs font-bold text-teal-700 hover:underline break-all mt-1 block"
                  >
                    {selected.email}
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Phone size={11} /> Phone
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selected.phone || "Not provided"}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Globe size={11} /> Country
                  </p>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {selected.country || "India"}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Customer Message Body
                </h4>
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-5 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed shadow-2xs">
                  {selected.message}
                </div>
              </div>

              {/* Reply Action */}
              <div className="pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(
                    selected.subject || "Your Inquiry at Swoo"
                  )}`}
                  className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-teal-600/25 transition"
                >
                  <Send size={13} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
