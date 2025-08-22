"use client";

import Image from "next/image";
import Link from "next/link";
import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: CourseWithProgressWithFaculty;
}

export function CourseCard({ course }: CourseCardProps) {
  const { id, title, progress, tuition, faculty, tutors, imageUrl, description } = course;
  const formattedProgress = typeof progress === 'number' ? progress.toFixed(2) : "0.00";
  const paymentStatus = tuition?.status ?? "Not Enrolled";
  const amount = tuition?.amount && /^[0-9]+(\.[0-9]{1,2})?$/.test(tuition.amount)
    ? parseFloat(tuition.amount).toFixed(2)
    : "0.00";
  const facultyName = faculty?.title ?? "No Faculty";
  const tutorTitles =
    tutors.length > 0
      ? tutors.map((tutor) => tutor.title).join(", ")
      : "No Tutors";
  const courseImage = imageUrl ?? "/placeholder.png";
  const courseDescription = description ?? "No description available";

  console.log('CourseCard imageUrl:', { courseId: id, imageUrl });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <Link href={`/courses/${id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="relative w-full h-40">
            <Image
              src={courseImage}
              alt={`${title} image`}
              fill
              objectFit="cover"
              className="rounded-md"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
          </div>
          <div>
            <span className="font-semibold">Description:</span> {courseDescription}
          </div>
          <div>
            <span className="font-semibold">Progress:</span> {formattedProgress}%
          </div>
          <Progress value={progress ?? 0} />
          <div>
            <span className="font-semibold">Payment Status:</span> {paymentStatus}
          </div>
          <div>
            <span className="font-semibold">Amount:</span> ${amount}
          </div>
          <div>
            <span className="font-semibold">Faculty:</span> {facultyName}
          </div>
          <div>
            <span className="font-semibold">Tutors:</span> {tutorTitles}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
