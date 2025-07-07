import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Course, Tutor, UserProgress} from "@prisma/client";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    tutors: (Tutor & {
      userProgress: UserProgress[] | null;    
    })[]
  };
  progressCount: number;
}
export const CourseSidebar = async ({
  course,
  // progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();
  if (!userId) {
    return <div>Please log in to view this page.</div>;
  }
  const tuition = await db.tuition.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
              <h1 className="font-semibold">{course.title}</h1>
              {/**TODO: Check tuition and add progress */}
          </div>
          <div className="flex flex-col w-full">
              {course.tutors.map((tutor) => (
                  <CourseSidebarItem
                      key={tutor.id}
                      id={tutor.id}
                      label={tutor.title}
                      isCompleted={!!tutor.userProgress?.[0]?.isCompleted}
                      courseId={course.id}
                      isLocked={!tutor.isFree && !tuition}
                  />
              ))}              
          </div>
    </div>
  );
};
export default CourseSidebar;
