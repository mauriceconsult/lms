"use client";

import { StudentCourseworkForm } from "./student-coursework-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { submitCoursework } from "@/app/(dashboard)/(routes)/faculty/create-faculty/[facultyId]/coursework/[courseworkId]/actions";

export default function CourseworkIdClient({
  coursework,
  userId,
  facultyId,
  courseworkId,
}: {
  coursework: Awaited<ReturnType<typeof db.coursework.findUnique>>;
  userId: string;
  facultyId: string;
  courseworkId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const requiredFields = [coursework!.title, coursework!.description];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;

  const handleSubmit = async (formData: {
    title: string;
    abstract: string;
    description: string;
  }): Promise<void> => {
    startTransition(async () => {
      await submitCoursework({
        ...formData,
        courseworkId,
        studentId: userId,
      });
      router.push(
        `/faculties/${facultyId}/courseworks/${courseworkId}/submitted`
      );
    });
  };

  return (
    <>
      {!coursework!.isPublished && (
        <Banner
          variant="warning"
          label="This Coursework is unpublished. Once published, students can submit their projects."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between w-full mt-4">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Coursework Submission</h1>
                <div className="text-sm text-slate-700">
                  <div>Completed fields {completionText}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2 mb-10">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Review and submit your Coursework</h2>
              </div>
              <StudentCourseworkForm
                onSubmit={handleSubmit}
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
