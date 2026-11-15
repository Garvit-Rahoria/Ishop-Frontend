import React from "react";
import { getBrands } from "@/api/api-call";
import BrandClient from "./BrandClient";

export const dynamic = "force-dynamic";

export default async function BrandPage() {
  let brands = [];
  let meta = {};

  try {
    const res = await getBrands();
    brands = res.data || [];
    meta = res.meta || {};
  } catch (error) {
    console.error("Failed to load brands:", error);
    brands = [];
  }

  return <BrandClient initialBrands={brands} meta={meta} />;
}
