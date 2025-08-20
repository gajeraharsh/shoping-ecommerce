"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Private({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, tokenPresent, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) return;
    // If definitely unauthenticated, go to login with redirect back
    if (!tokenPresent && !user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitializing, tokenPresent, user, router, pathname]);

  // Loading states to avoid flicker and premature redirects
  if (isInitializing) return null;
  if (tokenPresent && !user) return null; // token present, waiting to hydrate user
  if (!tokenPresent && !user) return null; // navigating to login

  return children;
}
