"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
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
  const Icon = CheckCircle;
  const isActive = pathname?.includes(id);
  const onClick = () => {
    router.push(`/faculties/${facultyId}/courses/${id}`);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isActive && "bg-emerald-200/20"
      )}
    >
      <div>
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-slate-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
