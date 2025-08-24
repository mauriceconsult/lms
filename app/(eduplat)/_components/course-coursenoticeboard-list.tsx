// app/(eduplat)/_components/course-coursenoticeboard-list.tsx
import { CourseNoticeboardCard } from "./courseNoticeboard-card"; // Updated import path
import { CourseNoticeboardWithCourse } from "@/app/(eduplat)/types/course-noticeboard";

interface CourseNoticeboardListProps {
  items: CourseNoticeboardWithCourse[];
}

export const CourseNoticeboardList = ({
  items,
}: CourseNoticeboardListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseNoticeboardCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description ?? undefined}
            course={item.course?.title ?? ""}
            courseNoticeboardsLength={
              item.course?.courseNoticeboards?.length ?? 0
            }
            progress={null}
            adminId={item.course?.adminId ?? null}
            courseId={item.course?.id ?? null}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Course Noticeboards found.
        </div>
      )}
    </div>
  );
};
