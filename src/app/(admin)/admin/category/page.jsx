import React from "react";
import { getCategories } from "@/api/api-call";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  let categories = [];
  let meta = {};

  try {
    const res = await getCategories();
    categories = res.data || [];
    meta = res.meta || {};
  } catch (error) {
    console.error("Failed to load categories:", error);
    categories = [];
  }

  return <CategoryClient initialCategories={categories} meta={meta} />;
}
