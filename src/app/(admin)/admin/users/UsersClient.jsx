"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  UserCheck,
  ShieldCheck,
  ShoppingBag,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  X,
  Loader2,
  Filter,
  ShieldAlert,
  ArrowUpDown,
  UserX,
} from "lucide-react";
import Swal from "sweetalert2";
import { client, notify } from "@/utils/helper";
import { formatCurrency, formatDate } from "@/utils/adminFormatters";

export default function UsersClient({ initialUsers = [], initialMeta = {} }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");

  const [actionLoading, setActionLoading] = useState(null); // id currently updating
  const [selectedUser, setSelectedUser] = useState(null); // for Details modal

  // Filter users based on search & dropdowns
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const emailMatch = u.email?.toLowerCase().includes(q);
      const mobileMatch = u.mobile?.toLowerCase().includes(q);
      const matchesSearch = !q || nameMatch || emailMatch || mobileMatch;

      let matchesRole = true;
      if (roleFilter === "admin") {
        matchesRole = u.role === "admin" || u.role === "superAdmin";
      } else if (roleFilter === "user") {
        matchesRole = u.role === "user";
      }

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = Boolean(u.status);
      if (statusFilter === "inactive") matchesStatus = !Boolean(u.status);

      let matchesVerified = true;
      if (verifiedFilter === "verified") matchesVerified = Boolean(u.isVerified);
      if (verifiedFilter === "unverified") matchesVerified = !Boolean(u.isVerified);

      return matchesSearch && matchesRole && matchesStatus && matchesVerified;
    });
  }, [users, search, roleFilter, statusFilter, verifiedFilter]);

  // Quick stats
  const totalUsers = users.length;
  const activeCount = users.filter((u) => u.status).length;
  const verifiedCount = users.filter((u) => u.isVerified).length;
  const adminCount = users.filter((u) => u.role === "admin" || u.role === "superAdmin").length;

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setVerifiedFilter("all");
  };

  const isFiltered = search || roleFilter !== "all" || statusFilter !== "all" || verifiedFilter !== "all";

  // Toggle user active status
  const handleToggleStatus = async (user) => {
    if (user.role === "admin" || user.role === "superAdmin") {
      notify("Admin account is protected and cannot be deactivated", false);
      return;
    }

    setActionLoading(user._id);
    try {
      const res = await client.patch(`/user/status/${user._id}`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, status: !u.status } : u
          )
        );
        notify(res.data.message || "User status updated", true);
      } else {
        notify(res.data.message || "Failed to update status", false);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update status", false);
    } finally {
      setActionLoading(null);
    }
  };

  // Change user role (user <-> admin)
  const handleChangeRole = async (user, newRole) => {
    if (user.role === "admin" || user.role === "superAdmin") {
      notify("Admin role is fixed and cannot be changed", false);
      return;
    }

    if (user.role === newRole) return;

    const confirm = await Swal.fire({
      title: `Change role to ${newRole}?`,
      text: `Are you sure you want to change ${user.name}'s role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, change role",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    setActionLoading(user._id);
    try {
      const res = await client.patch(`/user/role/${user._id}`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, role: newRole } : u
          )
        );
        notify(res.data.message || "User role updated", true);
      } else {
        notify(res.data.message || "Failed to update role", false);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to update role", false);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (user) => {
    if (user.role === "admin" || user.role === "superAdmin") {
      notify("Admin accounts are protected and cannot be deleted", false);
      return;
    }

    const confirm = await Swal.fire({
      title: `Delete user ${user.name}?`,
      text: "This action cannot be undone. User account and credentials will be removed.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete user",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    setActionLoading(user._id);
    try {
      const res = await client.delete(`/user/delete/${user._id}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        notify(res.data.message || "User deleted", true);
      } else {
        notify(res.data.message || "Failed to delete user", false);
      }
    } catch (err) {
      notify(err?.response?.data?.message || "Failed to delete user", false);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Registered Users
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
              {totalUsers} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Monitor user signups, authentication status, customer order histories, and permissions.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalUsers}</p>
          <p className="text-xs text-slate-400 mt-1">All registered accounts</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Active Accounts
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{activeCount}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {totalUsers > 0 ? Math.round((activeCount / totalUsers) * 100) : 0}% active
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Email Verified
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{verifiedCount}</p>
          <p className="text-xs text-slate-400 mt-1">OTP verified customers</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Admin Team
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{adminCount}</p>
          <p className="text-xs text-slate-400 mt-1">Staff &amp; administrators</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or mobile..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Customers Only</option>
            <option value="admin">Admins Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Verification Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>

          {isFiltered ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-2 rounded-xl border border-rose-100 hover:bg-rose-50 transition cursor-pointer"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/90 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Orders &amp; Spent</th>
                <th className="py-3.5 px-4">Registered</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <UserX size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm text-slate-600">No users found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === "admin" || user.role === "superAdmin";
                  const initial = user.name ? user.name[0].toUpperCase() : "U";

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/75 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAdmin
                              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                              : "bg-teal-100 text-teal-800 border border-teal-200"
                          }`}>
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Mail size={11} />
                              <span>{user.email}</span>
                            </p>
                            {user.mobile ? (
                              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Phone size={11} />
                                <span>+91 {user.mobile}</span>
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>

                      {/* Role Pill & Dropdown */}
                      <td className="py-3.5 px-4">
                        {isAdmin ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 select-none cursor-default"
                            title="Admin Account"
                          >
                            <ShieldCheck size={13} className="text-indigo-600" />
                            <span>{user.role === "superAdmin" ? "Super Admin" : "Admin"}</span>
                          </span>
                        ) : (
                          <select
                            value={user.role || "user"}
                            disabled={actionLoading === user._id}
                            onChange={(e) => handleChangeRole(user, e.target.value)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg border outline-none bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 focus:border-teal-500 cursor-pointer transition"
                            title="Change user role"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>

                      {/* Verification Badge */}
                      <td className="py-3.5 px-4">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <XCircle size={12} />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>

                      {/* Order Stats */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                            <ShoppingBag size={13} className="text-teal-600" />
                            <span>{user.orderCount || 0} Orders</span>
                          </span>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {formatCurrency(user.totalSpent || 0)}
                          </p>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          disabled={isAdmin || actionLoading === user._id}
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                            isAdmin
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-not-allowed opacity-75"
                              : user.status
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                              : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 cursor-pointer"
                          } disabled:cursor-not-allowed`}
                          title={isAdmin ? "Admin account is protected and cannot be deactivated" : "Toggle status"}
                        >
                          {actionLoading === user._id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <span className={`w-2 h-2 rounded-full ${user.status ? "bg-emerald-500" : "bg-rose-500"}`} />
                          )}
                          <span>{user.status ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition cursor-pointer"
                            title="View User Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            disabled={isAdmin || actionLoading === user._id}
                            onClick={() => handleDeleteUser(user)}
                            className={`p-1.5 rounded-lg border transition ${
                              isAdmin
                                ? "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
                                : "border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 cursor-pointer"
                            }`}
                            title={isAdmin ? "Admin accounts cannot be deleted" : "Delete User"}
                          >
                            {actionLoading === user._id ? (
                              <Loader2 size={15} className="animate-spin text-rose-600" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser ? (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-bold text-lg flex items-center justify-center border border-teal-200">
                  {selectedUser.name ? selectedUser.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Account Meta Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Role</p>
                  <p className="font-bold text-slate-800 capitalize mt-0.5">
                    {selectedUser.role || "user"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Email Verified</p>
                  <p className={`font-bold mt-0.5 ${selectedUser.isVerified ? "text-emerald-600" : "text-amber-600"}`}>
                    {selectedUser.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Orders Placed</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedUser.orderCount || 0} Orders
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Total Spent</p>
                  <p className="font-bold text-teal-700 mt-0.5">
                    {formatCurrency(selectedUser.totalSpent || 0)}
                  </p>
                </div>
              </div>

              {/* Delivery Addresses */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-teal-600" />
                  <span>Delivery Addresses ({selectedUser.addresses?.length || 0})</span>
                </h4>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1"
                      >
                        <p className="font-bold text-slate-800">
                          {addr.fullName}{" "}
                          <span className="font-normal text-slate-500">
                            (+91 {addr.mobile})
                          </span>
                        </p>
                        <p className="text-slate-600">{addr.addressLine}</p>
                        <p className="text-slate-500">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                    No delivery addresses saved yet.
                  </p>
                )}
              </div>

              {/* Account Timestamps */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                <span>Joined: {formatDate(selectedUser.createdAt)}</span>
                <span>User ID: {selectedUser._id}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

