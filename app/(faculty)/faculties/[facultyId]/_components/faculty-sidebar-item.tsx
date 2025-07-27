"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FacultySidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const FacultySidebarItem = ({
  icon: Icon,
  label,
  href,
}: FacultySidebarItemProps) => {
  if (!href) {
    console.error(`FacultySidebarItem: href is undefined for label "${label}"`);
    return null; // Prevent rendering if href is undefined
  }

  return (
    <Link
      href={href}
      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};
