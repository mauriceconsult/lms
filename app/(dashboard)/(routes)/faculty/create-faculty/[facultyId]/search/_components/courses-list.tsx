// import { CourseCard } from "@/components/course-card";
import { Faculty, Course } from "@prisma/client";

type CourseWithProgressWithFaculty = Course & {
  faculty: Faculty | null;
  tutors: { id: string }[];
  progress: number | null;
};
interface CoursesListProps {
  item: CourseWithProgressWithFaculty[];
}

export const CoursesList = ({ item }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {/* <CourseCard
          key={item.}
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          topicLength={item.topicLength}
          amount={item.amount}
          progress={item.progress}
          faculty={item?.faculty?.title}
        /> */}
      </div>
      {item.length === 0 && <div>No Courses found.</div>}
    </div>
  );
};
