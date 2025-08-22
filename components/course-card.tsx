import { CourseWithProgressWithFaculty } from "@/actions/get-dashboard-courses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: CourseWithProgressWithFaculty;
}

export function CourseCard({ course }: CourseCardProps) {
  const { title, progress, tuition, faculty, tutors } = course;
  const formattedProgress = progress !== null ? progress.toFixed(2) : "0.00";
  const paymentStatus = tuition?.status ?? "Not Enrolled";
  const amount = tuition?.amount
    ? parseFloat(tuition.amount).toFixed(2)
    : "0.00";
  const facultyName = faculty?.title ?? "No Faculty";
  const tutorTitles =
    tutors.length > 0
      ? tutors.map((tutor) => tutor.title).join(", ")
      : "No Tutors";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Progress:</span> {formattedProgress}
            %
          </div>
          <Progress value={progress ?? 0} />
          <div>
            <span className="font-semibold">Payment Status:</span>{" "}
            {paymentStatus}
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
