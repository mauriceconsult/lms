import { db } from "@/lib/db";
import { School, Faculty } from "@prisma/client";
import FacultiesListContent from "@/app/(course)/courses/[courseId]/courseCourseNoticeboards/_components/faculties-list-content";

type FacultiesWithSchool = Faculty & {
  school: School | null;
  courses: { id: string }[];
  noticeboardsCount?: number;
};

interface FacultiesListProps {
  items: FacultiesWithSchool[];
  viewMode?: "admin" | "student";
}

export async function FacultiesList({
  items,
  viewMode = "admin",
}: FacultiesListProps) {
  let processedItems = items;

  if (viewMode === "student") {
    const facultyIds = items.map((item) => item.id);

    // Fetch noticeboard counts
    const noticeboardCounts = await db.noticeboard.groupBy({
      by: ["facultyId"],
      where: {
        facultyId: { in: facultyIds },
        isPublished: true,
      },
      _count: {
        id: true,
      },
    });

    // Map counts and filter
    const countMap = new Map(
      noticeboardCounts.map((c) => [c.facultyId, c._count.id])
    );
    processedItems = items
      .map((item) => ({
        ...item,
        noticeboardsCount: countMap.get(item.id) ?? 0,
      }))
      .filter((item) => item.noticeboardsCount > 0);
  }

  return <FacultiesListContent items={processedItems} viewMode={viewMode} />;
}
