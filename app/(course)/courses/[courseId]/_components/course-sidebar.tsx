import { Logo } from "@/app/(dashboard)/_components/logo";
import { FC } from "react";


// Define the CourseSidebarProps interface
interface CourseSidebarProps {
  course: {
    id: string;
    title: string;
    description?: string | null;
    createdAt: Date;
    tutors: {
      id: string;
      title: string | null;
      userProgress: {
        id: string;
        userId: string;
        courseId: string;
        tutorId?: string | null;
        courseworkId?: string | null;
        assignmentId?: string | null;
        isCompleted: boolean;
        isEnrolled: boolean;
      }[];
      userId: string | null;
      position: number;
      isPublished: boolean;
      createdAt: Date;
      updatedAt: Date;
      facultyId: string | null;
      courseId: string | null;
      objective: string | null;
      videoUrl: string | null;
      isCompleted: boolean;
      playbackId: string | null;
      isFree: boolean | null;
      muxDataId: string | null;
    }[];
    userProgress: {
      id: string;
      userId: string;
      courseId: string;
      tutorId?: string | null;
      courseworkId?: string | null;
      assignmentId?: string | null;
      isCompleted: boolean;
      isEnrolled: boolean;
    }[];
  } | null;
  progressCount:
    | {
        course: {
          id: string;
          title: string;
          description?: string | null;
          createdAt: Date;
          userProgress: {
            id: string;
            userId: string;
            courseId: string;
            tutorId?: string | null;
            courseworkId?: string | null;
            assignmentId?: string | null;
            isCompleted: boolean;
            isEnrolled: boolean;
          }[];
          attachments: {
            id: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
            facultyId: string | null;
            tutorId: string | null;
            assignmentId: string | null;
            courseworkId: string | null;
            noticeboardId: string | null;
            courseNoticeboardId: string | null;
            tuitionId: string | null;
            payrollId: string | null;
            facultyPayrollId: string | null;
          }[];
        } | null;
        tutor: {
          id: string;
          title: string | null;
          userProgress: {
            id: string;
            userId: string;
            courseId: string;
            tutorId: string;
            courseworkId?: string | null;
            assignmentId?: string | null;
            isCompleted: boolean;
            isEnrolled: boolean;
          }[];
          attachments: {
            id: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
            facultyId: string | null;
            tutorId: string | null;
            assignmentId: string | null;
            courseworkId: string | null;
            noticeboardId: string | null;
            courseNoticeboardId: string | null;
            tuitionId: string | null;
            payrollId: string | null;
            facultyPayrollId: string | null;
          }[];
        } | null;
        coursework: {
          id: string;
          title: string;
          userProgress: {
            id: string;
            userId: string;
            courseId: string;
            tutorId?: string | null;
            courseworkId: string;
            assignmentId?: string | null;
            isCompleted: boolean;
            isEnrolled: boolean;
          }[];
          attachments: {
            id: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
            facultyId: string | null;
            tutorId: string | null;
            assignmentId: string | null;
            courseworkId: string | null;
            noticeboardId: string | null;
            courseNoticeboardId: string | null;
            tuitionId: string | null;
            payrollId: string | null;
            facultyPayrollId: string | null;
          }[];
        } | null;
        assignment: {
          id: string;
          title: string;
          description?: string | null;
          createdAt: Date;
          userProgress: {
            id: string;
            userId: string;
            courseId: string;
            tutorId?: string | null;
            courseworkId?: string | null;
            assignmentId: string;
            isCompleted: boolean;
            isEnrolled: boolean;
          }[];
          attachments: {
            id: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string | null;
            facultyId: string | null;
            tutorId: string | null;
            assignmentId: string | null;
            courseworkId: string | null;
            noticeboardId: string | null;
            courseNoticeboardId: string | null;
            tuitionId: string | null;
            payrollId: string | null;
            facultyPayrollId: string | null;
          }[];
        } | null;
        attachments: {
          id: string;
          url: string;
          createdAt: Date;
          updatedAt: Date;
          courseId: string | null;
          facultyId: string | null;
          tutorId: string | null;
          assignmentId: string | null;
          courseworkId: string | null;
          noticeboardId: string | null;
          courseNoticeboardId: string | null;
          tuitionId: string | null;
          payrollId: string | null;
          facultyPayrollId: string | null;
        }[];
      }
    | { error: string };
}

// Apply CourseSidebarProps to the CourseSidebar component
const CourseSidebar: FC<CourseSidebarProps> = ({ course, progressCount }) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
    </div>
  );
};

export default CourseSidebar;
