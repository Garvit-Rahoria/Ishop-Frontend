import React from "react";
import { getColors } from "@/api/api-call";
import ColorClient from "./ColorClient";

export const dynamic = "force-dynamic";

export default async function ColorPage() {
  let colors = [];

  try {
    const res = await getColors();
    colors = res.data || [];
  } catch (error) {
    console.error("Failed to load colors:", error);
    colors = [];
  }

  return <ColorClient initialColors={colors} />;
}
