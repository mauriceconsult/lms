"use client";

import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface FacultySidebarItemProps {
  label: string;
  id: string;
  facultyId: string;
}

export const FacultySidebarItem = ({
  label,
  id,
  facultyId,
}: FacultySidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = PlayCircle;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/faculties/${facultyId}/courses/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={`Go to course: ${label}`}
      className={cn(
        "flex items-center gap-x-2 text-gray-500 text-sm font-medium pl-6 transition-all hover:bg-gray-100 hover:text-gray-700",
        isActive && "text-gray-700 bg-gray-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-gray-500", isActive && "text-gray-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-gray-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
