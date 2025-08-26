"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface InstaSkulLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const InstaSkulLogo: React.FC<InstaSkulLogoProps> = ({
  className,
  size = "md",
}) => {
  const sizeStyles = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link
      href="/"
      className={cn(
        "font-bold text-slate-900 tracking-tight",
        sizeStyles[size],
        className
      )}
    >
      instaSkul
    </Link>
  );
};
