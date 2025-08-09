"use client";

import { useEffect, useState } from "react";
import { FacultyCard } from "@/components/faculty-card";

interface FacultyCardWrapperProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  school: string;
  initialRole: "admin" | "student" | null;
}

export const FacultyCardWrapper: React.FC<FacultyCardWrapperProps> = ({
  id,
  title,
  imageUrl,
  description,
  school,
  initialRole,
}) => {
  const [role, setRole] = useState<"admin" | "student" | null>(initialRole);

  useEffect(() => {
    // Sync with localStorage role
    const storedRole = localStorage.getItem("selectedRole") as
      | "admin"
      | "student"
      | null;
    setRole(storedRole || initialRole || "student");
  }, [initialRole]);

  return (
    <FacultyCard
      id={id}
      title={title}
      imageUrl={imageUrl}
      description={description}
      school={school}
      role={role}
    />
  );
};
