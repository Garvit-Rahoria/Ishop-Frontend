import React from "react";
import { getOrders } from "@/api/api-call";
import OrderClient from "./OrderClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  let orders = [];

  try {
    const res = await getOrders();
    orders = Array.isArray(res?.orders) ? res.orders : [];
  } catch (error) {
    console.error("Failed to load orders:", error);
    orders = [];
  }

  return <OrderClient initialOrders={orders} />;
}
