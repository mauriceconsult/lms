import { CourseNoticeboardCard } from "@/components/courseNoticeboard-card";
import { Course, CourseNoticeboard } from "@prisma/client";

type CourseNoticeboardWithCourse = CourseNoticeboard & {
  course: Course | null;
  courseNoticeboards: { id: string }[];
};
interface CourseNoticeboardsListProps {
  items: CourseNoticeboardWithCourse[];
}
export const CourseNoticeboardsList = ({ items }: CourseNoticeboardsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseNoticeboardCard
            key={item.id}
            id={item.id}
            title={item.title}           
            course={item?.course?.title ?? ""}
            courseNoticeboardsLength={0}        
            progress={null}
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
