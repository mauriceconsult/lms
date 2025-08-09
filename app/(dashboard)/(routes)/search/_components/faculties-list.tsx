import FacultiesListContent from "@/app/(course)/courses/[courseId]/courseworks/_components/faculties-list-content";
import { db } from "@/lib/db";
import { School, Faculty } from "@prisma/client";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
};

interface FacultiesListProps {
  items: FacultiesWithSchool[];
  viewMode?: "admin" | "student";
}

export async function FacultiesList({ items, viewMode = "admin" }: FacultiesListProps) {
  // Fetch coursework counts for filtering in student view
  const facultyIds = items.map((item) => item.id);
  const courseworkCounts = viewMode === "student"
    ? await db.coursework.groupBy({
        by: ["facultyId"],
        where: {
          facultyId: { in: facultyIds },
          isPublished: true,
        },
        _count: {
          id: true,
        },
      })
    : [];

  // Filter faculties with published courseworks in student view
  const filteredItems = viewMode === "student"
    ? items.filter((item) =>
        courseworkCounts.some((count) => count.facultyId === item.id && count._count.id > 0)
      )
    : items;

  return <FacultiesListContent items={filteredItems} viewMode={viewMode} />;
};
