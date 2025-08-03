"use client";

import { useRouter } from "next/navigation";
import { FacultyCard } from "@/components/faculty-card";
import { School, Faculty } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};

interface FacultiesListContentProps {
  items: FacultiesWithSchool[];
  viewMode: "admin" | "student";
}

export default function FacultiesListContent({ items, viewMode }: FacultiesListContentProps) {
  const router = useRouter();

  const toggleViewMode = () => {
    const newMode = viewMode === "admin" ? "student" : "admin";
    void router.push(`/search?view=${newMode}`, { scroll: false });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Faculties</h2>
        <button
          onClick={toggleViewMode}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Switch to {viewMode === "admin" ? "Student" : "Admin"} View
        </button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <FacultyCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl ?? ""}
            description={item.description ?? ""}
            school={item?.school?.name ?? ""}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Faculties found.
        </div>
      )}
    </div>
  );
}
