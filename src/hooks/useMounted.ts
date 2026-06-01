"use client";

import { useEffect, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Avoid setting state directly inside an effect body (ESLint rule).
    setTimeout(() => setMounted(true), 0);
  }, []);
  return mounted;
}
