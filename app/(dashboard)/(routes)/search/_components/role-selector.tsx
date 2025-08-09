"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  initialRole: "admin" | "student" | null;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ initialRole }) => {
  const { isSignedIn } = useUser();
  const [role, setRole] = useState<"admin" | "student" | null>(
    initialRole || "student"
  );

  useEffect(() => {
    // Persist role to localStorage
    if (role) {
      localStorage.setItem("selectedRole", role);
    }
  }, [role]);

  if (!isSignedIn) {
    return null; // Hide for unauthenticated users
  }

  return (
    <Select
      value={role || "student"}
      onValueChange={(value: "admin" | "student") => setRole(value)}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
