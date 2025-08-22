import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { groupByCourse, TuitionWithCourse } from "@/actions/group-by-course";
// import { CoursesList } from "@/components/courses-list";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { CoursesList } from "../(routes)/faculty/create-faculty/[facultyId]/course/[courseId]/search/_components/courses-list";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  const tuitions: TuitionWithCourse[] = await db.tuition.findMany({
    where: {
      userId,
      status: { in: ["pending", "completed"] },
    },
    include: {
      course: true,
    },
  });

  const revenueByCourse = groupByCourse(tuitions);

  const chartData = {
    labels: Object.keys(revenueByCourse),
    datasets: [
      {
        label: "Revenue by Course ($)",
        data: Object.values(revenueByCourse),
        backgroundColor: ["#4CAF50", "#2196F3"],
        borderColor: ["#388E3C", "#1976D2"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Course Title",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Revenue by Course",
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Revenue by Course</h2>
        <Bar data={chartData} options={chartOptions} />
        {Object.entries(revenueByCourse).map(([title, amount]) => (
          <p key={title}>
            {title}: ${amount.toFixed(2)}
          </p>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-2">Courses in Progress</h2>
      <CoursesList items={coursesInProgress} />
      <h2 className="text-xl font-semibold mb-2 mt-6">Completed Courses</h2>
      <CoursesList items={completedCourses} />
    </div>
  );
}
