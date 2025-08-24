// app/(course)/courses/[courseId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { getCourseData } from "@/actions/get-course-data";
import ErrorBoundary from "@/components/error-boundary";
import { VideoPlayer } from "@/app/(course)/courses/[courseId]/(tutor)/tutors/[tutorId]/_components/video-player";
import { Menu } from "lucide-react";
import EnrollButton from "./_components/enroll-button";
import { CourseWithProgressWithAdmin } from "@/app/(eduplat)/types/course";
import React from "react";
import TutorList from "@/app/(dashboard)/(routes)/admin/create-admin/[adminId]/course/[courseId]/tutorial/[tutorialId]/search/_components/tutors-list";

export default function CoursePage({
  params: paramsPromise,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const { userId } = useAuth();
  const [course, setCourse] = useState<CourseWithProgressWithAdmin | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const params = React.use(paramsPromise);

  useEffect(() => {
    async function fetchCourse() {
      if (!userId) {
        console.log(
          `[${new Date().toISOString()} CoursePage] No userId, redirecting to /sign-in`
        );
        router.push("/sign-in");
        return;
      }

      const courseData = await getCourseData(params.courseId, userId);
      if (!courseData) {
        console.log(
          `[${new Date().toISOString()} CoursePage] No course data, redirecting to /`
        );
        router.push("/");
        return;
      }

      setCourse(courseData);
    }
    fetchCourse();
  }, [params.courseId, userId, router]);

  if (!course) {
    return (
      <ErrorBoundary>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-medium">Loading...</h2>
        </div>
      </ErrorBoundary>
    );
  }

  const isEnrolled = course.userProgress[0]?.isEnrolled || false;
  const isPaid = course.tuition?.isPaid || false;
  const firstNonFreeTutor =
    course.tutors.find((tutor) => !(tutor.isFree ?? false)) || course.tutors[0];

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-50">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white p-4 border-r transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:transform-none sm:static sm:w-64 sm:block`}
          id="mobile-sidebar"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tutorials</h2>
            <button
              className="sm:hidden p-2"
              onClick={() => {
                setIsSidebarOpen(false);
                console.log(
                  `[${new Date().toISOString()} CoursePage] Sidebar closed`
                );
              }}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <TutorList
            tutorials={course.tutors}
            courseId={params.courseId}
            isEnrolled={isEnrolled}
          />
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <button
            className="sm:hidden mb-4 p-2 bg-gray-200 rounded-md"
            onClick={() => {
              setIsSidebarOpen(true);
              console.log(
                `[${new Date().toISOString()} CoursePage] Sidebar opened`
              );
            }}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {course.title}
          </h1>
          <div className="mb-4 text-sm sm:text-base">
            <span className="font-semibold">Description:</span>{" "}
            {course.description ?? "No description available"}
          </div>
          <div className="relative w-full h-40 sm:h-48 mb-4">
            <Image
              src={course.imageUrl ?? "/placeholder.png"}
              alt={`${course.title} image`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="rounded-md"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
          </div>
          {firstNonFreeTutor && (
            <div className="mb-4">
              <VideoPlayer
                playbackId={firstNonFreeTutor.playbackId ?? ""}
                courseId={params.courseId}
                tutorId={firstNonFreeTutor.id}
                nextTutorId={
                  course.tutors[
                    course.tutors.findIndex(
                      (t) => t.id === firstNonFreeTutor.id
                    ) + 1
                  ]?.id ?? ""
                }
                isLocked={!(firstNonFreeTutor.isFree ?? false) && !isEnrolled}
                completeOnEnd={
                  !(firstNonFreeTutor.isFree ?? false) && isEnrolled
                }
                title={firstNonFreeTutor.title}
              />
            </div>
          )}
          {isPaid ? (
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Progress:</span>{" "}
                {course.progress?.toFixed(2) ?? "0.00"}%
              </div>
              <div>
                <span className="font-semibold">Payment Status:</span>{" "}
                {course.tuition?.status ?? "Not Enrolled"}
              </div>
              <div>
                <span className="font-semibold">Amount:</span> $
                {course.tuition?.amount &&
                /^[0-9]+(\.[0-9]{1,2})?$/.test(course.tuition.amount)
                  ? parseFloat(course.tuition.amount).toFixed(2)
                  : "0.00"}
              </div>
              <div>
                <span className="font-semibold">Admin:</span>{" "}
                {course.admin?.title ?? "No Admin"}
              </div>
            </div>
          ) : (
            <EnrollButton courseId={params.courseId} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
