import React from "react";
import { getProducts } from "@/api/api-call";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function ProductPage() {
  let products = [];
  let meta = {};

  try {
    const res = await getProducts();
    products = res.data || [];
    meta = res.meta || {};
  } catch (error) {
    console.error("Failed to load products:", error);
    products = [];
  }

  return <ProductClient initialProducts={products} meta={meta} />;
}
