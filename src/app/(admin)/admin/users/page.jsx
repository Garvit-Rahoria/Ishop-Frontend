import React from "react";
import { getAdminUsers } from "@/api/api-call";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users = [];
  let meta = {};

  try {
    const res = await getAdminUsers();
    users = Array.isArray(res?.data) ? res.data : [];
    meta = res?.meta || {};
  } catch (error) {
    console.error("Failed to load users:", error);
    users = [];
  }

  return <UsersClient initialUsers={users} initialMeta={meta} />;
}

