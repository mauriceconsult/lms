// components/ClientUserButton.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function ClientUserButton() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Skip rendering during SSR
  }

  return <UserButton afterSwitchSessionUrl="/" />;
}
