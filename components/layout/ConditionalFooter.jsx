"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname() || "";

  // Hide footer on checkout, account, and reels pages
  const hide = pathname.startsWith("/checkout") || pathname.startsWith("/account") || pathname.startsWith("/reels");

  if (hide) return null;
  return <Footer />;
}
